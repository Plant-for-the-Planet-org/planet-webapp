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
  getFeaturesAtPoint,
  getPlantLocationInfo,
  getSiteIndex,
  getValidFeatures,
  INTERACTIVE_LAYERS,
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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [wasTimeTravelMounted, setWasTimeTravelMounted] = useState(false);

  const sitesGeoJson = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features:
        singleProject?.sites?.filter((site) => site.geometry !== null) ?? [],
    };
  }, [singleProject?.sites]);

  useEffect(() => {
    if (!mapLoaded) return;
    // Ensure the map resizes properly once it's fully loaded.
    mapRef.current?.resize();
  }, [mapLoaded]);

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
    singleProject !== null && props.page === 'project-details' && mapLoaded;
  const shouldShowMultipleProjectsView =
    Boolean(mapOptions.projects) &&
    projects &&
    projects.length > 0 &&
    !shouldShowSingleProjectsView &&
    mapLoaded;
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
      const features = getFeaturesAtPoint(mapRef, e.point);
      if (!features || features.length === 0) return;

      const hoveredPlantLocation = getPlantLocationInfo(
        plantLocations,
        features
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
  /**
   * Map click handler invoked when user clicks on the map in 'project-details' page.
   * This onClick handler is responsible for:
   * - Selecting: point plant locations(single tree), polygon plant locations(multi tree), or project sites
   * - Deselecting: point plant locations ,sample point plant locations, other interventions(point geometry)
   */
  const onClick = useCallback(
    (e) => {
      if (props.page !== 'project-details') return;

      const features = getFeaturesAtPoint(mapRef, e.point);
      if (!features || features.length === 0) return;

      const plantLocationInfo = getPlantLocationInfo(plantLocations, features);
      const isSamePlant = plantLocationInfo?.id === selectedPlantLocation?.id;
      const isPointGeometry =
        plantLocationInfo !== undefined &&
        plantLocationInfo.geometry.type === 'Point';

      const sites = singleProject?.sites || [];
      const hasSites = sites.length > 0;
      const siteIndex = hasSites ? getSiteIndex(sites, features) : null;

      // Deselect sample point plant location when clicking the parent plant polygon
      if (selectedSamplePlantLocation) setSelectedSamplePlantLocation(null);

      // Deselect if clicking the same single tree point plant location again
      if (isSamePlant && isPointGeometry) {
        setSelectedPlantLocation(null);
        if (siteIndex !== null && siteIndex >= 0) {
          setSelectedSite(siteIndex);
        } else {
          setSelectedSite(null);
        }
        return;
      }
      // If clicking a point/polygon plant location, set it and clear selected site
      if (plantLocationInfo) {
        setSelectedPlantLocation(plantLocationInfo);
        setSelectedSite(null);
        return;
      } else {
        // Otherwise, check if a site polygon was clicked
        if (siteIndex !== null && siteIndex >= 0) {
          setSelectedSite(siteIndex);
          setSelectedPlantLocation(null);
          setHoveredPlantLocation(null);
          return;
        }
      }
    },
    [
      plantLocations,
      props.page,
      selectedPlantLocation,
      singleProject,
      selectedSamplePlantLocation,
    ]
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
          onLoad={() => setMapLoaded(true)}
          onMouseMove={onMouseMove}
          onMouseOut={() => setHoveredPlantLocation(null)}
          onClick={onClick}
          attributionControl={false}
          ref={mapRef}
          interactiveLayerIds={
            singleProject !== null ? INTERACTIVE_LAYERS : undefined
          }
          style={{ width: '100%', height: '100%' }}
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
