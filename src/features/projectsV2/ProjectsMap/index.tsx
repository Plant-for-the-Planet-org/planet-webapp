import type { ViewStateChangeEvent } from 'react-map-gl-v7/maplibre';
import type { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import type { SetState } from '../../common/types/common';
import type { PlantLocationSingle } from '../../common/types/plantLocation';
import type { ExtendedMapLibreMap, MapRef } from '../../common/types/projectv2';
import type { SelectedTab } from './ProjectMapTabs';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useProjectsMap } from '../ProjectsMapContext';
import { useFetchLayers } from '../../../utils/mapsV2/useFetchLayers';
import MultipleProjectsView from './MultipleProjectsView';
import SingleProjectView from './SingleProjectView';
import {
  areMapCoordsEqual,
  calculateCentroid,
  centerMapOnCoordinates,
  getDeviceType,
  getPlantLocationInfo,
  getValidFeatures,
} from '../../../utils/projectV2';
import MapControls from './MapControls';
import MapTabs from './ProjectMapTabs';
import { useProjects } from '../ProjectsContext';
import MultiPlantLocationInfo from '../ProjectDetails/components/MultiPlantLocationInfo';
import SinglePlantLocationInfo from '../ProjectDetails/components/SinglePlantLocationInfo';
import styles from './ProjectsMap.module.scss';
import { useDebouncedEffect } from '../../../utils/useDebouncedEffect';
import OtherInterventionInfo from '../ProjectDetails/components/OtherInterventionInfo';
import { PLANTATION_TYPES } from '../../../utils/constants/intervention';
import ExploreLayers from './ExploreLayers';

const TimeTravel = dynamic(() => import('./TimeTravel'), {
  ssr: false,
  loading: () => <p>Loading comparison...</p>,
});

export type ProjectsMapDesktopProps = {
  isMobile: false;
  page: 'project-list' | 'project-details';
};
export type ProjectsMapMobileProps = {
  selectedMode: ViewMode;
  setSelectedMode: SetState<ViewMode>;
  isMobile: true;
  page: 'project-list' | 'project-details';
};
export type ProjectsMapProps = ProjectsMapMobileProps | ProjectsMapDesktopProps;

function ProjectsMap(props: ProjectsMapProps) {
  // Fetch layers data
  useFetchLayers();

  const mapRef: MapRef = useRef<ExtendedMapLibreMap | null>(null);
  const {
    viewState,
    handleViewStateChange,
    mapState,
    mapOptions,
    timeTravelConfig,
    setTimeTravelConfig,
    isExploreMode,
  } = useProjectsMap();
  const {
    plantLocations,
    setHoveredPlantLocation,
    setSelectedPlantLocation,
    setSelectedSite,
    setSelectedSamplePlantLocation,
    filteredProjects,
    projects,
    singleProject,
    selectedPlantLocation,
    selectedSamplePlantLocation,
  } = useProjects();
  const [selectedTab, setSelectedTab] = useState<SelectedTab | null>(null);
  const [wasTimeTravelMounted, setWasTimeTravelMounted] = useState(false);

  const sitesGeoJson = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features:
        singleProject?.sites?.filter((site) => site.geometry !== null) ?? [],
    };
  }, [singleProject?.sites]);

  useEffect(() => {
    if (props.page === 'project-details') {
      setSelectedTab('field');
    } else {
      setTimeTravelConfig(null);
      setSelectedTab(null);
      setWasTimeTravelMounted(false);
    }
  }, [props.page]);

  useEffect(() => {
    if (selectedTab === 'timeTravel') {
      setWasTimeTravelMounted(true);
    }
  }, [selectedTab]);

  useDebouncedEffect(
    () => {
      const map = mapRef.current;
      const shouldCenterMap =
        filteredProjects !== undefined &&
        filteredProjects.length > 0 &&
        (filteredProjects.length < 30 ||
          filteredProjects.length === projects?.length) &&
        map !== null &&
        props.page === 'project-list';

      if (!shouldCenterMap) return;
      const validFeatures = getValidFeatures(filteredProjects);
      if (validFeatures.length === 0) return;

      const centroid = calculateCentroid(validFeatures);
      if (!centroid.geometry) return;

      const currentCenter = map.getCenter();
      if (areMapCoordsEqual(currentCenter, centroid.geometry.coordinates))
        return;

      centerMapOnCoordinates(mapRef, centroid.geometry.coordinates);
    },
    250,
    [filteredProjects]
  );

  const shouldShowSingleProjectsView =
    singleProject !== null && props.page === 'project-details';
  const shouldShowMultipleProjectsView =
    Boolean(mapOptions.projects) &&
    projects &&
    projects.length > 0 &&
    !shouldShowSingleProjectsView;
  const shouldShowMultiPlantLocationInfo =
    props.isMobile &&
    selectedSamplePlantLocation === null &&
    selectedPlantLocation?.type === 'multi-tree-registration';
  const shouldShowSinglePlantLocationInfo =
    props.isMobile &&
    (selectedSamplePlantLocation !== null ||
      selectedPlantLocation?.type === 'single-tree-registration');
  const shouldShowNavigationControls = !(
    shouldShowMultiPlantLocationInfo || shouldShowSinglePlantLocationInfo
  );
  const isTimeTravelEnabled =
    shouldShowSingleProjectsView &&
    timeTravelConfig !== null &&
    timeTravelConfig.sources !== null &&
    timeTravelConfig.projectId === singleProject?.id &&
    !props.isMobile;
  const shouldShowTimeTravel =
    isTimeTravelEnabled &&
    (selectedTab === 'timeTravel' || wasTimeTravelMounted);
  const shouldShowMapTabs = selectedTab !== null;
  const shouldShowExploreLayers =
    props.page === 'project-list' && isExploreMode;

  const mobileOS = useMemo(() => getDeviceType(), [props.isMobile]);
  const mapControlProps = {
    selectedMode: props.isMobile ? props.selectedMode : undefined,
    setSelectedMode: props.isMobile ? props.setSelectedMode : undefined,
    selectedTab,
    isMobile: props.isMobile,
    page: props.page,
    mobileOS,
  };

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      handleViewStateChange(evt.viewState);
    },
    [handleViewStateChange]
  );

  const onMouseMove = useCallback(
    (e) => {
      if (props.page !== 'project-details') return;
      const hoveredPlantLocation = getPlantLocationInfo(
        plantLocations,
        mapRef,
        e.point
      );
      if (
        !hoveredPlantLocation ||
        hoveredPlantLocation.hid === selectedPlantLocation?.hid
      ) {
        setHoveredPlantLocation(null);
        return;
      }
      setHoveredPlantLocation(hoveredPlantLocation);
    },
    [plantLocations, props.page, selectedPlantLocation]
  );

  const onClick = useCallback(
    (e) => {
      if (props.page !== 'project-details') return;
      const hasNoSites = singleProject?.sites?.length === 0;
      const result = getPlantLocationInfo(plantLocations, mapRef, e.point);
      const isSamePlantLocation =
        result?.geometry.type === 'Point' &&
        result.id === selectedPlantLocation?.id;
      const isSingleTree =
        selectedPlantLocation?.type === 'single-tree-registration';
      const isMultiTree =
        selectedPlantLocation?.type === 'multi-tree-registration';
      // const isOther = selectedPlantLocation?.type !== 'single-tree-registration' && selectedPlantLocation?.type !== 'multi-tree-registration';
      // Clear sample plant location on clicking outside.
      // Clicks on sample plant location will not propagate on the map
      setSelectedSamplePlantLocation(null);
      // Clear plant location info if clicked twice (single or multi tree) // point plant location
      if (isSamePlantLocation && (isSingleTree || isMultiTree)) {
        setSelectedPlantLocation(null);
        setSelectedSite(hasNoSites ? null : 0);
        return;
      }

      // Set selected plant location if a result is found
      if (result) {
        setSelectedSite(null);
        setSelectedPlantLocation(result);
      }
    },
    [plantLocations, props.page, selectedPlantLocation]
  );

  const singleProjectViewProps = {
    mapRef,
    selectedTab,
  };

  const multipleProjectsViewProps = {
    mapRef,
    page: props.page,
  };

  const mapContainerClass = `${styles.mapContainer} ${
    styles[mobileOS !== undefined ? mobileOS : '']
  }`;

  const shouldShowOtherIntervention =
    props.isMobile &&
    selectedPlantLocation !== null &&
    !PLANTATION_TYPES.includes(selectedPlantLocation.type);

  return (
    <>
      <MapControls {...mapControlProps} />

      <div className={mapContainerClass}>
        {shouldShowMapTabs && (
          <MapTabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            isTimeTravelEnabled={isTimeTravelEnabled}
          />
        )}
        {shouldShowTimeTravel && (
          <div>
            <TimeTravel
              sitesGeoJson={sitesGeoJson}
              isVisible={selectedTab === 'timeTravel'}
            />
          </div>
        )}
        <Map
          {...viewState}
          {...mapState}
          onMove={onMove}
          onMouseMove={onMouseMove}
          onMouseOut={() => setHoveredPlantLocation(null)}
          onClick={onClick}
          attributionControl={false}
          ref={mapRef}
          interactiveLayerIds={
            singleProject !== null
              ? ['plant-polygon-layer', 'point-layer']
              : undefined
          }
        >
          {shouldShowExploreLayers && <ExploreLayers />}
          {shouldShowSingleProjectsView && (
            <SingleProjectView {...singleProjectViewProps} />
          )}
          {shouldShowMultipleProjectsView && (
            <MultipleProjectsView {...multipleProjectsViewProps} />
          )}
          {shouldShowNavigationControls && (
            <NavigationControl position="bottom-right" showCompass={false} />
          )}
        </Map>
      </div>
      {shouldShowMultiPlantLocationInfo && (
        <MultiPlantLocationInfo
          plantLocationInfo={selectedPlantLocation}
          isMobile={props.isMobile}
          setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
        />
      )}
      {shouldShowSinglePlantLocationInfo && (
        <SinglePlantLocationInfo
          plantData={
            selectedSamplePlantLocation ||
            (selectedPlantLocation as PlantLocationSingle)
          }
          isMobile={props.isMobile}
          setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
        />
      )}
      {shouldShowOtherIntervention ? (
        <OtherInterventionInfo
          selectedPlantLocation={
            selectedPlantLocation &&
            selectedPlantLocation?.type !== 'single-tree-registration' &&
            selectedPlantLocation?.type !== 'multi-tree-registration'
              ? selectedPlantLocation
              : null
          }
          setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
          isMobile={props.isMobile}
        />
      ) : null}
    </>
  );
}

export default ProjectsMap;
