import type { MobileOs } from '../../../utils/projectV2';
import type { SelectedTab } from './ProjectMapTabs';
import type { DropdownType } from '../../common/types/projectv2';
import type { InterventionTypes } from '@planet-sdk/common';
import type { Page } from '../../../stores/viewStore';

import { useMemo, useState } from 'react';
import ProjectSiteDropdown from './ProjectSiteDropDown';
import InterventionDropDown from './InterventionDropDown';
import ProjectListControlForMobile from '../ProjectListControls/ProjectListControlForMobile';
import { useProjects } from '../ProjectsContext';
import LayerIcon from '../../../../public/assets/images/icons/LayerIcon';
import LayerDisabled from '../../../../public/assets/images/icons/LayerDisabled';
import CrossIcon from '../../../../public/assets/images/icons/projectV2/CrossIcon';
import styles from '../ProjectsMap/ProjectsMap.module.scss';
import { AllInterventions } from '../../../utils/constants/intervention';
import { clsx } from 'clsx';
import { useQueryParamStore } from '../../../stores/queryParamStore';
import { useProjectMapStore } from '../../../stores/projectMapStore';
import { useViewStore } from '../../../stores';

interface MapControlsProps {
  isMobile: boolean;
  selectedTab: SelectedTab | null;
  currentPage: Page;
  mobileOS: MobileOs;
}

const MapControls = ({
  isMobile,
  selectedTab,
  currentPage,
  mobileOS,
}: MapControlsProps) => {
  const {
    singleProject,
    selectedSite,
    setSelectedSite,
    selectedIntervention,
    selectedSampleTree,
    setSelectedIntervention,
    setSelectedSampleTree,
    selectedInterventionType,
    setSelectedInterventionType,
    interventions,
  } = useProjects();
  // local state
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  // store: state
  const isSatelliteView = useProjectMapStore((state) => state.isSatelliteView);
  const mapOptions = useProjectMapStore((state) => state.mapOptions);
  const isEmbedMode = useQueryParamStore((state) => state.embed === 'true');
  const showProjectDetails = useQueryParamStore(
    (state) => state.showProjectDetails
  );
  // store: action
  const setIsSatelliteView = useProjectMapStore(
    (state) => state.setIsSatelliteView
  );
  const updateMapOption = useProjectMapStore((state) => state.updateMapOption);
  const setSelectedMode = useViewStore((state) => state.setSelectedMode);

  const availableInterventionTypes = useMemo(() => {
    if (!interventions) return [];

    const types = new Set<InterventionTypes>();
    for (let i = 0; i < interventions.length; i++) {
      types.add(interventions[i].type);
    }
    return [...types];
  }, [interventions]);

  const hasProjectSites =
    singleProject?.sites?.length !== undefined &&
    singleProject?.sites?.length > 0;
  const canShowSatelliteToggle =
    !(
      isMobile &&
      (selectedIntervention !== null || selectedSampleTree !== null)
    ) && selectedTab === 'field';
  const isProjectDetailsPage = currentPage === 'project-details';
  const canShowInterventionDropdown =
    isProjectDetailsPage &&
    selectedTab === 'field' &&
    availableInterventionTypes.length > 1;
  const onlyMapModeAllowed =
    isEmbedMode &&
    isMobile &&
    currentPage === 'project-details' &&
    showProjectDetails === 'false';

  const siteDropdownProps = {
    selectedSite,
    setSelectedSite,
    projectSites: singleProject?.sites,
    selectedIntervention,
    setSelectedIntervention,
    setSelectedSampleTree,
    activeDropdown,
    setActiveDropdown,
  };

  const interventionDropDownProps = {
    selectedInterventionType,
    setSelectedInterventionType,
    allInterventions: AllInterventions,
    selectedIntervention,
    setSelectedIntervention,
    setSelectedSampleTree,
    activeDropdown,
    setActiveDropdown,
    hasProjectSites,
    availableInterventionTypes,
  };
  const exitMapMode = () => setSelectedMode('list');

  const layerToggleClass = clsx(styles.layerToggle, {
    [styles.layerToggleAndroid]: isMobile && mobileOS === 'android',
    [styles.layerToggleIos]: isMobile && mobileOS === 'ios',
    [styles.layerToggleDesktop]: !isMobile,
  });

  const projectListControlsContainerStyles = clsx(
    styles.projectListControlsContainer,
    { [styles.embedModeMobile]: isEmbedMode }
  );
  const siteInterventionDropdownsMobileStyles = clsx(
    styles.siteInterventionDropdownsMobile,
    { [styles.embedModeMobile]: isEmbedMode }
  );

  return (
    <>
      {isMobile && currentPage === 'project-list' && (
        <div className={projectListControlsContainerStyles}>
          <ProjectListControlForMobile
            isMobile={isMobile}
            mapOptions={mapOptions}
            updateMapOption={updateMapOption}
          />
        </div>
      )}
      {isProjectDetailsPage && (
        <>
          {isMobile ? (
            <div className={siteInterventionDropdownsMobileStyles}>
              {hasProjectSites && (
                <ProjectSiteDropdown {...siteDropdownProps} />
              )}
              {canShowInterventionDropdown && (
                <InterventionDropDown
                  {...interventionDropDownProps}
                  isMobile={isMobile}
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
            <div className={styles.siteInterventionDropdowns}>
              {hasProjectSites && (
                <ProjectSiteDropdown {...siteDropdownProps} />
              )}
              {canShowInterventionDropdown && (
                <InterventionDropDown {...interventionDropDownProps} />
              )}
            </div>
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
