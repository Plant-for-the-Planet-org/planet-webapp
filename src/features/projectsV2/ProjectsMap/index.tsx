import Map, { MapRef } from 'react-map-gl-v7/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useRef } from 'react';
import { useProjectsMap } from '../ProjectsMapContext';
import MultipleProjectsView from './MultipleProjectsView';
import { useProjects } from '../ProjectsContext';
import ProjectListControlForMobile from '../ProjectListControls/ProjectListControlForMobile';
import { SetState } from '../../common/types/common';
import styles from './ProjectsMap.module.scss';
import { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import DeforestationLayers from './MapLayers/DeforestationLayers';

type ProjectsMapMobileProps = {
  selectedMode: ViewMode;
  setSelectedMode: SetState<ViewMode>;
  isMobile: true;
};

type ProjectsMapDesktopProps = {
  isMobile: false;
};

type ProjectsMapProps = ProjectsMapMobileProps | ProjectsMapDesktopProps;

function ProjectsMap(props: ProjectsMapProps) {
  const mapRef = useRef<MapRef>(null);
  const { viewState, setViewState, mapState, mapOptions, setIsMapLoaded } =
    useProjectsMap();
  const {
    projects,
    topProjects,
    selectedClassification,
    filteredProjects,
    setSelectedClassification,
    debouncedSearchValue,
    setDebouncedSearchValue,
    isSearching,
    setIsSearching,
  } = useProjects();
  const topProjectCount = topProjects?.length;
  const projectCount = projects?.length;

  const projectListControlProps = {
    projectCount,
    topProjectCount,
    selectedClassification,
    setSelectedClassification,
    debouncedSearchValue,
    setDebouncedSearchValue,
    selectedMode: props.isMobile ? props.selectedMode : undefined,
    setSelectedMode: props.isMobile ? props.setSelectedMode : undefined,
    filteredProjects,
    isMobile: props.isMobile,
    isSearching,
    setIsSearching,
  };

  return (
    <>
      {props.isMobile && (
        <div className={styles.projectListControlsContainer}>
          <ProjectListControlForMobile {...projectListControlProps} />
        </div>
      )}
      <Map
        {...viewState}
        {...mapState}
        onMove={(e) => setViewState(e.viewState)}
        attributionControl={false}
        ref={mapRef}
        onLoad={() => setIsMapLoaded(true)}
      >
        {mapOptions.showProjects && projects && <MultipleProjectsView />}
        {mapOptions.showDeforestation === true && (
          <DeforestationLayers mapRef={mapRef} />
        )}
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>
    </>
  );
}

export default ProjectsMap;
