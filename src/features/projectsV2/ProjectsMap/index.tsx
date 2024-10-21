import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useCallback, useEffect } from 'react';
import { useRef } from 'react';
import { useProjectsMap } from '../ProjectsMapContext';
import MultipleProjectsView from './MultipleProjectsView';
import SingleProjectView from './SingleProjectView';
import {
  calculateCentroid,
  centerMapOnCoordinates,
  getPlantLocationInfo,
  getValidFeatures,
} from '../../../utils/projectV2';
import MapControls from './MapControls';
import { useProjects } from '../ProjectsContext';
import { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import { SetState } from '../../common/types/common';
import MultiPlantLocationInfo from '../ProjectDetails/components/MultiPlantLocationInfo';
import SinglePlantLocationInfo from '../ProjectDetails/components/SinglePlantLocationInfo';
import { PlantLocationSingle } from '../../common/types/plantLocation';
import { ExtendedMapLibreMap, MapRef } from '../../common/types/projectv2';

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
  const mapRef: MapRef = useRef<ExtendedMapLibreMap | null>(null);
  const { viewState, setViewState, mapState, mapOptions } = useProjectsMap();
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

  useEffect(() => {
    const canCenterMap =
      filteredProjects !== undefined &&
      filteredProjects.length > 0 &&
      mapRef.current;
    if (!canCenterMap) return;

    const validFeatures = getValidFeatures(filteredProjects);
    if (validFeatures.length === 0) return;

    const centroid = calculateCentroid(validFeatures);
    if (centroid.geometry)
      centerMapOnCoordinates(mapRef, centroid.geometry.coordinates);
  }, [filteredProjects]);

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

  const mapControlProps = {
    selectedMode: props.isMobile ? props.selectedMode : undefined,
    setSelectedMode: props.isMobile ? props.setSelectedMode : undefined,
    isMobile: props.isMobile,
    page: props.page,
  };

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
  };
  const multipleProjectsViewProps = {
    mapRef,
    setViewState,
    page: props.page,
  };
  return (
    <>
      <MapControls {...mapControlProps} />
      <Map
        {...viewState}
        {...mapState}
        onMove={(e) => setViewState(e.viewState)}
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
          <NavigationControl
            position="bottom-right"
            showCompass={false}
            style={{
              position: 'relative',
              bottom: props.isMobile ? '120px' : '0px',
            }}
          />
        )}
      </Map>
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
    </>
  );
}

export default ProjectsMap;
