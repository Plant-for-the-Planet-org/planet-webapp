import Map from 'react-map-gl-v7/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useRef, MutableRefObject } from 'react';
import { useProjectsMap } from '../ProjectsMapContext';
import MultipleProjectsView from './MultipleProjectsView';
import { useProjects } from '../ProjectsContext';
import ProjectListControlForMobile from '../ProjectListControls/ProjectListControlForMobile';
import { SetState } from '../../common/types/common';
import style from './ProjectsMap.module.scss';

interface ProjectsMapProp {
  selectedMode: 'list' | 'map';
  setSelectedMode: SetState<'list' | 'map'>;
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
    filteredTopProjects,
    tabSelected,
    setTabSelected,
    setSelectedClassification,
    setDebouncedSearchValue,
    filteredRegularProjects,
    searchProjectResults,
  } = useProjects();
  const topProjectCount = selectedClassification.length
    ? filteredTopProjects?.length
    : topProjects?.length;

  const projectCount = selectedClassification.length
    ? filteredRegularProjects?.length
    : projects?.length;

  const projectListControlProps = {
    projectCount,
    topProjectCount,
    tabSelected,
    setTabSelected,
    selectedClassification,
    setSelectedClassification,
    setDebouncedSearchValue,
    selectedMode,
    setSelectedMode,
    searchProjectResults,
    isMobile,
  };
  return (
    <>
      {isMobile && (
        <div className={style.projectListControlsContainer}>
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
        {projects && (
          <MultipleProjectsView
            selectedMode={selectedMode}
            isMobile={isMobile}
          />
        )}
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>
    </>
  );
}

export default ProjectsMap;
