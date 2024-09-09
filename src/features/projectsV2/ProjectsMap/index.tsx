import Map from 'react-map-gl-v7/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useRef, MutableRefObject } from 'react';
import { useProjectsMap } from '../ProjectsMapContext';
import MultipleProjectsView from './MultipleProjectsView';
import { useProjects } from '../ProjectsContext';
import { SetState } from '../../common/types/common';
import { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import MobileControls from './microComponents/MobileControls';

type ProjectsMapMobileProps = {
  selectedMode: ViewMode;
  setSelectedMode: SetState<ViewMode>;
  isMobile: true;
  page: 'project-list' | 'project-details';
};

type ProjectsMapDesktopProps = {
  isMobile: false;
};

type ProjectsMapProps = ProjectsMapMobileProps | ProjectsMapDesktopProps;

function ProjectsMap(props: ProjectsMapProps) {
  const mapRef: MutableRefObject<null> = useRef(null);
  const { viewState, setViewState, mapState, mapOptions } = useProjectsMap();
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
    page: props.isMobile ? props.page : undefined,
  };

  return (
    <>
      <MobileControls {...projectListControlProps} />
      <Map
        {...viewState}
        {...mapState}
        onMove={(e) => setViewState(e.viewState)}
        attributionControl={false}
        ref={mapRef}
      >
        {mapOptions.showProjects && projects && <MultipleProjectsView />}
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>
    </>
  );
}

export default ProjectsMap;
