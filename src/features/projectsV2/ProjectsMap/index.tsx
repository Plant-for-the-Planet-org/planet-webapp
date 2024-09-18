import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useCallback } from 'react';
import { useRef, MutableRefObject } from 'react';
import { useProjectsMap } from '../ProjectsMapContext';
import MultipleProjectsView from './MultipleProjectsView';
import { useProjects } from '../ProjectsContext';
import SingleProjectView from './SingleProjectView';
import { getPlantLocationInfo } from './utils';
import MapControls from './MapControls';
import { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import { SetState } from '../../common/types/common';

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
  const mapRef: MutableRefObject<null> = useRef(null);
  const { viewState, setViewState, mapState, mapOptions } = useProjectsMap();
  const { plantLocations, setHoveredPl, setSelectedPl, samplePlantLocation } =
    useProjects();
  const { projects, singleProject } = useProjects();
  const shouldShowSingleProjectsView = singleProject !== null;
  const shouldShowMultipleProjectsView =
    mapOptions.showProjects &&
    projects &&
    projects.length > 0 &&
    !shouldShowSingleProjectsView;

  const pageProps = {
    selectedMode: props.isMobile ? props.selectedMode : undefined,
    setSelectedMode: props.isMobile ? props.setSelectedMode : undefined,
    isMobile: props.isMobile,
    page: props.page,
  };

  const onMouseMove = useCallback(
    (e) => {
      const hoveredPlantLocation = getPlantLocationInfo(
        plantLocations,
        mapRef,
        e.point
      );
      if (hoveredPlantLocation) setHoveredPl(hoveredPlantLocation);
    },
    [plantLocations]
  );
  const onMouseLeave = () => {
    setHoveredPl(null);
  };
  const onClick = useCallback(
    (e) => {
      const selectedPlantLocation = getPlantLocationInfo(
        plantLocations,
        mapRef,
        e.point
      );
      if (selectedPlantLocation) setSelectedPl(selectedPlantLocation);
    },
    [plantLocations]
  );
  return (
    <>
      <MapControls {...pageProps} />
      <Map
        {...viewState}
        {...mapState}
        onMove={(e) => setViewState(e.viewState)}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        attributionControl={false}
        ref={mapRef}
        interactiveLayerIds={
          shouldShowSingleProjectsView
            ? ['plant-polygon-layer', 'point-layer']
            : undefined
        }
      >
        {shouldShowSingleProjectsView && <SingleProjectView mapRef={mapRef} />}
        {shouldShowMultipleProjectsView && (
          <MultipleProjectsView setViewState={setViewState} mapRef={mapRef} />
        )}
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>
    </>
  );
}

export default ProjectsMap;
