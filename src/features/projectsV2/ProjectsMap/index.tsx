import type { ViewStateChangeEvent } from 'react-map-gl-v7/maplibre';
import type { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import type { SetState } from '../../common/types/common';
import type { PlantLocationSingle } from '../../common/types/plantLocation';
import type { ExtendedMapLibreMap, MapRef } from '../../common/types/projectv2';

import { useCallback, useMemo, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useProjectsMap } from '../ProjectsMapContext';
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
import { useProjects } from '../ProjectsContext';
import MultiPlantLocationInfo from '../ProjectDetails/components/MultiPlantLocationInfo';
import SinglePlantLocationInfo from '../ProjectDetails/components/SinglePlantLocationInfo';
import styles from './ProjectsMap.module.scss';
import { useDebouncedEffect } from '../../../utils/useDebouncedEffect';
import OtherInterventionInfo from '../ProjectDetails/components/OtherInterventionInfo';
import { PLANTATION_TYPES } from '../../../utils/constants/intervention';

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
  // const [mobileOS, setMobileOS] = useState<MobileOs>(null);
  const mapRef: MapRef = useRef<ExtendedMapLibreMap | null>(null);
  const { viewState, handleViewStateChange, mapState, mapOptions } =
    useProjectsMap();
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
    mapOptions.showProjects &&
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
  const mobileOS = useMemo(() => getDeviceType(), [props.isMobile]);
  const mapControlProps = {
    selectedMode: props.isMobile ? props.selectedMode : undefined,
    setSelectedMode: props.isMobile ? props.setSelectedMode : undefined,
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

  const onClick = useCallback((e) => {
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
  )

  const singleProjectViewProps = {
    mapRef,
  };
  const multipleProjectsViewProps = {
    mapRef,
    page: props.page,
  };
  const mapContainerClass = `${styles.mapContainer} ${styles[mobileOS !== undefined ? mobileOS : '']
    }`;
  const shouldShowOtherIntervention = props.isMobile && (selectedPlantLocation !== null && !PLANTATION_TYPES.includes(selectedPlantLocation.type))
  return (
    <>
      <MapControls {...mapControlProps} />
      <div className={mapContainerClass}>
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

      {shouldShowOtherIntervention && selectedPlantLocation.type !== 'single-tree-registration' ? <OtherInterventionInfo plantLocationInfo={selectedPlantLocation} setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
        isMobile={props.isMobile} /> : null}
    </>
  );
}

export default ProjectsMap;
