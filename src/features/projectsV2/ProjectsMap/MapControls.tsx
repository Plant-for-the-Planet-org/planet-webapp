import type { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import type { SetState } from '../../common/types/common';
import type { MobileOs } from '../../../utils/projectV2';
import type { SelectedTab } from './ProjectMapTabs';
import type { DropdownType } from '../../common/types/projectv2';

import { useContext, useMemo, useState } from 'react';
import ProjectSiteDropdown from './ProjectSiteDropDown';
import InterventionDropDown from './InterventionDropDown';
import ProjectListControlForMobile from '../ProjectListControls/ProjectListControlForMobile';
import { useProjectsMap } from '../ProjectsMapContext';
import { useProjects } from '../ProjectsContext';
import LayerIcon from '../../../../public/assets/images/icons/LayerIcon';
import LayerDisabled from '../../../../public/assets/images/icons/LayerDisabled';
import CrossIcon from '../../../../public/assets/images/icons/projectV2/CrossIcon';
import styles from '../ProjectsMap/ProjectsMap.module.scss';
import { AllInterventions } from '../../../utils/constants/intervention';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';

interface MapControlsProps {
  isMobile: boolean;
  selectedTab: SelectedTab | null;
  selectedMode: ViewMode | undefined;
  setSelectedMode: SetState<ViewMode> | undefined;
  page: 'project-list' | 'project-details';
  mobileOS: MobileOs;
}

const MapControls = ({
  isMobile,
  selectedMode,
  selectedTab,
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
    selectedInterventionType,
    setSelectedInterventionType,
    plantLocations,
    showDonatableProjects,
    setShowDonatableProjects,
  } = useProjects();
  const { embed, showProjectDetails } = useContext(ParamsContext);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const uniquePlantTypes = useMemo(() => {
    if (!plantLocations) return [];

    const types = new Set<string>();
    for (let i = 0; i < plantLocations.length; i++) {
      types.add(plantLocations[i].type);
    }
    return [...types];
  }, [plantLocations]);

  const hasProjectSites =
    singleProject?.sites?.length !== undefined &&
    singleProject?.sites?.length > 1;
  const canShowSatelliteToggle =
    !(
      isMobile &&
      (selectedPlantLocation !== null || selectedSamplePlantLocation !== null)
    ) && selectedTab === 'field';
  const isProjectDetailsPage = page === 'project-details';
  const canShowInterventionDropdown =
    isProjectDetailsPage &&
    selectedTab === 'field' &&
    uniquePlantTypes.length > 1;
  const onlyMapModeAllowed =
    embed === 'true' &&
    isMobile &&
    page === 'project-details' &&
    showProjectDetails === 'false';

  const siteDropdownProps = {
    selectedSite,
    setSelectedSite,
    projectSites: singleProject?.sites,
    selectedPlantLocation,
    setSelectedPlantLocation,
    setSelectedSamplePlantLocation,
    activeDropdown,
    setActiveDropdown,
    canShowInterventionDropdown,
  };

  const interventionDropDownProps = {
    selectedInterventionType,
    setSelectedInterventionType,
    allInterventions: AllInterventions,
    selectedPlantLocation,
    setSelectedPlantLocation,
    setSelectedSamplePlantLocation,
    activeDropdown,
    setActiveDropdown,
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
    showDonatableProjects,
    setShowDonatableProjects,
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
  const projectListControlsContainerStyles = `${
    styles.projectListControlsContainer
  } ${embed === 'true' ? styles.embedModeMobile : ''}`;
  const projectDetailsControlsContainerStyles = `${
    styles.projectDetailsControlsContainer
  } ${embed === 'true' ? styles.embedModeMobile : ''}`;

  return (
    <>
      {isMobile && page === 'project-list' && (
        <div className={projectListControlsContainerStyles}>
          <ProjectListControlForMobile {...projectListControlProps} />
        </div>
      )}
      {isProjectDetailsPage && (
        <>
          {isMobile ? (
            <div className={projectDetailsControlsContainerStyles}>
              {hasProjectSites && (
                <ProjectSiteDropdown {...siteDropdownProps} />
              )}
              {canShowInterventionDropdown && (
                <InterventionDropDown
                  {...interventionDropDownProps}
                  isMobile={isMobile}
                  hasProjectSites={hasProjectSites}
                  existingIntervention={uniquePlantTypes}
                />
              )}
              {!onlyMapModeAllowed && (
                <button
                  className={styles.exitMapModeButton}
                  onClick={exitMapMode}
                >
                  <CrossIcon width={18} />
                </button>
              )}
            </div>
          ) : (
            <>
              {hasProjectSites && (
                <ProjectSiteDropdown {...siteDropdownProps} />
              )}
              {canShowInterventionDropdown && (
                <InterventionDropDown
                  {...interventionDropDownProps}
                  hasProjectSites={hasProjectSites}
                  existingIntervention={uniquePlantTypes}
                />
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
