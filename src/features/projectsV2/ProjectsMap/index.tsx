import Map from 'react-map-gl-v7/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useRef, MutableRefObject, useMemo } from 'react';
import { useProjectsMap } from '../ProjectsMapContext';
import MultipleProjectsView from './MultipleProjectsView';
import { useProjects } from '../ProjectsContext';
import ProjectListControlForMobile from '../ProjectListControls/ProjectListControlForMobile';
import { SetState } from '../../common/types/common';
import styles from './ProjectsMap.module.scss';
import { ViewMode } from '../../../../pages/_app';

interface ProjectsMapProp {
  selectedMode: ViewMode;
  setSelectedMode: SetState<ViewMode>;
  isMobile: boolean;
}

function ProjectsMap({
  selectedMode,
  setSelectedMode,
  isMobile,
}: ProjectsMapProp) {
  const mapRef: MutableRefObject<null> = useRef(null);
  const { viewState, setViewState, mapState } = useProjectsMap();
  const {
    projects,
    topProjects,
    selectedClassification,
    filteredProjects,
    tabSelected,
    setTabSelected,
    setSelectedClassification,
    debouncedSearchValue,
    setDebouncedSearchValue,
  } = useProjects();
  const topProjectCount = topProjects?.length;
  const projectCount = projects?.length;

  const projectListControlProps = {
    projectCount,
    topProjectCount,
    tabSelected,
    setTabSelected,
    selectedClassification,
    setSelectedClassification,
    debouncedSearchValue,
    setDebouncedSearchValue,
    selectedMode,
    setSelectedMode,
    filteredProjects,
    isMobile,
  };

  return (
    <>
      {isMobile && (
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
      >
        {projects && <MultipleProjectsView />}
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>
    </>
  );
}

export default ProjectsMap;
