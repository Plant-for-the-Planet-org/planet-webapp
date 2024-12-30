import type { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import type { SetState } from '../../common/types/common';
import type { MobileOs } from '../../../utils/projectV2';

import ProjectSiteDropdown from './ProjectSiteDropDown';
import InterventionDropDown from './InterventionDropDown';
import ProjectListControlForMobile from '../ProjectListControls/ProjectListControlForMobile';
import { useProjectsMap } from '../ProjectsMapContext';
import { useProjects } from '../ProjectsContext';
import LayerIcon from '../../../../public/assets/images/icons/LayerIcon';
import LayerDisabled from '../../../../public/assets/images/icons/LayerDisabled';
import CrossIcon from '../../../../public/assets/images/icons/projectV2/CrossIcon';
import styles from '../ProjectsMap/ProjectsMap.module.scss';
import { AllIntervention } from '../../../utils/constants/intervention';

interface MapControlsProps {
  isMobile: boolean;
  selectedMode: ViewMode | undefined;
  setSelectedMode: SetState<ViewMode> | undefined;
  page: 'project-list' | 'project-details';
  mobileOS: MobileOs;
}

const MapControls = ({
  isMobile,
  selectedMode,
  setSelectedMode,
  page,
  mobileOS,
}: MapControlsProps) => {
  const { setIsSatelliteView, isSatelliteView, updateMapOption, mapOptions } =
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
    singleProject,
    selectedSite,
    setSelectedSite,
    selectedPlantLocation,
    selectedSamplePlantLocation,
    setSelectedPlantLocation,
    setSelectedSamplePlantLocation,
    selectedIntervention,
    setSelectedIntervention,
    disableInterventionMenu,
    setDisableInterventionMenu,
  } = useProjects();
  const hasProjectSites =
    singleProject?.sites?.length !== undefined &&
    singleProject?.sites?.length > 1;
  const canShowSatelliteToggle = !(
    isMobile &&
    (selectedPlantLocation !== null || selectedSamplePlantLocation !== null)
  );
  const isProjectDetailsPage = page === 'project-details';

  const enableInterventionFilter=()=>{
    setDisableInterventionMenu(true)
  }
  const disableInterventionFilter=()=>{
    setDisableInterventionMenu(false)
  }

  const siteDropdownProps = {
    selectedSite,
    setSelectedSite,
    projectSites: singleProject?.sites,
    selectedPlantLocation,
    setSelectedPlantLocation,
    setSelectedSamplePlantLocation,
    disableInterventionFilter,
    disableInterventionMenu
  };

  const InterventionDropdownProps = {
    selectedIntervention,
    setSelectedIntervention,
    allIntervention: AllIntervention,
    selectedPlantLocation,
    setSelectedPlantLocation,
    setSelectedSamplePlantLocation,
    enableInterventionFilter,
    disableInterventionMenu
  };
  const projectListControlProps = {
    ...siteDropdownProps,
    projectCount: projects?.length,
    topProjectCount: topProjects?.length,
    filteredProjects,
    selectedClassification,
    setSelectedClassification,
    debouncedSearchValue,
    setDebouncedSearchValue,
    selectedMode,
    setSelectedMode,
    isMobile,
    isSearching,
    setIsSearching,
    page,
    hasProjectSites,
    mapOptions,
    updateMapOption,
  };

  const exitMapMode = () => {
    setSelectedMode && setSelectedMode('list');
  };

  const layerToggleClass = `${styles.layerToggle} ${
    isMobile
      ? mobileOS === 'android'
        ? styles.layerToggleAndroid
        : styles.layerToggleIos
      : styles.layerToggleDesktop
  }`;

  return (
    <>
      {isMobile && page === 'project-list' && (
        <div className={styles.projectListControlsContainer}>
          <ProjectListControlForMobile {...projectListControlProps} />
        </div>
      )}
      {isProjectDetailsPage && (
        <>
          {isMobile ? (
            <div className={styles.projectDetailsControlsContainer}>
              {hasProjectSites && (
                <>
                <ProjectSiteDropdown {...siteDropdownProps} />
                <InterventionDropDown {...InterventionDropdownProps} isMobile={isMobile}/></>
              )}
              <button
                className={styles.exitMapModeButton}
                onClick={exitMapMode}
              >
                <CrossIcon width={18} />
              </button>
            </div>
          ) : (
            <>
              {hasProjectSites && (
                <>
                  <ProjectSiteDropdown {...siteDropdownProps} />
                  <InterventionDropDown {...InterventionDropdownProps} />
                </>
              )}
            </>
          )}
          {canShowSatelliteToggle && (
            <button
              className={layerToggleClass}
              onClick={() => setIsSatelliteView(!isSatelliteView)}
            >
              {isSatelliteView ? <LayerIcon /> : <LayerDisabled />}
            </button>
          )}
        </>
      )}
    </>
  );
};

export default MapControls;
