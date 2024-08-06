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
}

function ProjectsMap({ selectedMode, setSelectedMode }: ProjectsMapProp) {
  const mapRef: MutableRefObject<null> = useRef(null);
  const { viewState, setViewState, mapState } = useProjectsMap();
  const {
    projects,
    topProjects,
    selectedClassification,
    topFilteredProjects,
    isMobile,
    tabSelected,
    setTabSelected,
    setSelectedClassification,
    setDebouncedSearchValue,
    regularFilterProjects,
  } = useProjects();
  const topProjectCount = selectedClassification.length
    ? topFilteredProjects?.length
    : topProjects?.length;

  const projectCount = selectedClassification.length
    ? regularFilterProjects?.length
    : projects?.length;

  const projectControlProps = {
    projectCount,
    topProjectCount,
    tabSelected,
    setTabSelected,
    selectedClassification,
    setSelectedClassification,
    setDebouncedSearchValue,
    selectedMode,
    setSelectedMode,
  };
  return (
    <>
      {isMobile && (
        <div className={style.projectListControlsContainer}>
          <ProjectListControlForMobile {...projectControlProps} />
        </div>
      )}
      <Map
        {...viewState}
        {...mapState}
        onMove={(e) => setViewState(e.viewState)}
        attributionControl={false}
        ref={mapRef}
      >
        {projects && <MultipleProjectsView selectedMode={selectedMode} />}
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>
    </>
  );
}

export default ProjectsMap;
