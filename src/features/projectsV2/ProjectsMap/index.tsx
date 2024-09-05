import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { MapRef, NavigationControl } from 'react-map-gl-v7/maplibre';
import { useCallback } from 'react';
import { useRef, MutableRefObject } from 'react';
import { useProjectsMap } from '../ProjectsMapContext';
import MultipleProjectsView from './MultipleProjectsView';
import { useProjects } from '../ProjectsContext';
import { SetState } from '../../common/types/common';
import { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import MobileControls from './microComponents/MobileControls';
import SingleProjectView from './SingleProjectView';
import ProjectSiteDropdown from './ProjectSiteDropDown';
import styles from './ProjectsMap.module.scss';
import LayerIcon from '../../../../public/assets/images/icons/LayerIcon';
import LayerDisabled from '../../../../public/assets/images/icons/LayerDisabled';
import { getPlantLocationInfo } from './utils';

type ProjectsMapMobileProps = {
  selectedMode: ViewMode;
  setSelectedMode: SetState<ViewMode>;
  isMobile: true;
  page: 'project-list' | 'project-details';
};

type ProjectsMapDesktopProps = {
  isMobile: false;
  page: 'project-list' | 'project-details';
};

type ProjectsMapProps = ProjectsMapMobileProps | ProjectsMapDesktopProps;

function ProjectsMap(props: ProjectsMapProps) {
  const mapRef: MutableRefObject<MapRef | null> = useRef(null);
  const {
    viewState,
    setViewState,
    mapState,
    setIsSatelliteView,
    isSatelliteView,
  } = useProjectsMap();
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
    singleProject,
    selectedSite,
    setSelectedSite,
    plantLocations,
    setSelectedPl,
    setHoveredPl,
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
    page: props.page,
  };
  const siteDropdownProps = {
    selectedSite,
    setSelectedSite,
    projectSites: singleProject?.sites,
  };
  const projectSites = singleProject?.sites;
  const hasMoreThanOneSite =
    projectSites?.length !== undefined && projectSites?.length > 1;
  const hasSingleProject = singleProject !== null;
  const isProjectDetailsPage = props.page === 'project-details';

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
      <MobileControls {...projectListControlProps} />
      {isProjectDetailsPage && hasMoreThanOneSite && (
        <ProjectSiteDropdown {...siteDropdownProps} />
      )}
      {isProjectDetailsPage && (
        <button
          className={styles.layerToggle}
          onClick={() => setIsSatelliteView(!isSatelliteView)}
        >
          {isSatelliteView ? <LayerIcon /> : <LayerDisabled />}
        </button>
      )}
      <Map
        {...viewState}
        {...mapState}
        onMove={(e) => setViewState(e.viewState)}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        attributionControl={false}
        ref={mapRef}
        interactiveLayerIds={['plant-polygon-layer']}
      >
        {hasSingleProject && (
          <SingleProjectView mapRef={mapRef} isMobile={props.isMobile} />
        )}
        {projects && !hasSingleProject && (
          <MultipleProjectsView setViewState={setViewState} mapRef={mapRef} />
        )}
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>
    </>
  );
}

export default ProjectsMap;
