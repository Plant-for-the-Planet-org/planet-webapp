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
    setDebouncedSearchValue,
    searchProjectResults,
    debouncedSearchValue,
    doSearchResultsMatchFilters,
  } = useProjects();
  const topProjectCount = topProjects?.length;
  const projectCount = projects?.length;

  const projectsToDisplay = useMemo(() => {
    const isTopProjectTab = tabSelected === 0 || tabSelected === 'topProjects';
    const isFilterApplied = selectedClassification.length > 0;
    if (searchProjectResults && debouncedSearchValue) {
      if (isFilterApplied && doSearchResultsMatchFilters) {
        return searchProjectResults;
      } else if (isFilterApplied && !doSearchResultsMatchFilters) {
        return [];
      } else {
        return searchProjectResults;
      }
    }

    if (searchProjectResults?.length === 0 && debouncedSearchValue.length > 0)
      return [];

    if (isFilterApplied) {
      return filteredProjects;
    }
    //* If none of the above conditions are met, return all projects (for desktop version).
    //* However it return all projects base on selected tab(top/all) for mobile version
    return isMobile ? (isTopProjectTab ? topProjects : projects) : projects;
  }, [
    selectedMode,
    tabSelected,
    selectedClassification,
    topProjects,
    searchProjectResults,
    filteredProjects,
  ]);
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
        {projects && (
          <MultipleProjectsView projectsToDisplay={projectsToDisplay} />
        )}
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>
    </>
  );
}

export default ProjectsMap;
