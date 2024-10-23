import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useCallback, useEffect, useMemo } from 'react';
import { useRef } from 'react';
import { useProjectsMap } from '../ProjectsMapContext';
import MultipleProjectsView from './MultipleProjectsView';
import SingleProjectView from './SingleProjectView';
import {
  calculateCentroid,
  centerMapOnCoordinates,
  getDeviceType,
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
import styles from './ProjectsMap.module.scss';

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
  const mobileOS = useMemo(() => getDeviceType(), [props.isMobile]);
  const mapControlProps = {
    selectedMode: props.isMobile ? props.selectedMode : undefined,
    setSelectedMode: props.isMobile ? props.setSelectedMode : undefined,
    isMobile: props.isMobile,
    page: props.page,
    mobileOS,
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
      const result = getPlantLocationInfo(plantLocations, mapRef, e.point);
      const isClickedOnSamePlantLocation =
        result?.geometry.type === 'Point' &&
        result.id === selectedPlantLocation?.id &&
        singleProject?.slug;

      // Clear sample plant location on clicking outside.
      // Clicks on sample plant location will not propagate on the map
      setSelectedSamplePlantLocation(null);

      //Clear plant location info (single-tree-registration) if it is clicked twice
      if (isClickedOnSamePlantLocation) {
        setSelectedSite(0);
        setSelectedPlantLocation(null);
        return;
      }
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
  const mapContainerClass = `${styles.mapContainer} ${
    styles[mobileOS !== undefined ? mobileOS : '']
  }`;
  return (
    <>
      <MapControls {...mapControlProps} />
      <div className={mapContainerClass}>
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
    </>
  );
}

export default ProjectsMap;
