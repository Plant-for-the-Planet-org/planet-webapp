import type { MobileOs } from '../../../utils/projectV2';
import type { SelectedTab } from './ProjectMapTabs';
import type { DropdownType } from '../../common/types/projectv2';
import type { InterventionTypes } from '@planet-sdk/common';
import type { Page } from '../../../stores/viewStore';

import { useMemo, useState } from 'react';
import ProjectSiteDropdown from './ProjectSiteDropDown';
import InterventionDropDown from './InterventionDropDown';
import ProjectListControlForMobile from '../ProjectListControls/ProjectListControlForMobile';
import LayerIcon from '../../../../public/assets/images/icons/LayerIcon';
import LayerDisabled from '../../../../public/assets/images/icons/LayerDisabled';
import CrossIcon from '../../../../public/assets/images/icons/projectV2/CrossIcon';
import styles from '../ProjectsMap/ProjectsMap.module.scss';
import { AllInterventions } from '../../../utils/constants/intervention';
import { clsx } from 'clsx';
import {
  useInterventionStore,
  useSingleProjectStore,
  useViewStore,
  useProjectMapStore,
  useQueryParamStore,
} from '../../../stores';
import { hasNoSites } from '../../../utils/projectV2';

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
  // local state
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  // store: state
  const isSatelliteView = useProjectMapStore((state) => state.isSatelliteView);
  const mapOptions = useProjectMapStore((state) => state.mapOptions);
  const isEmbedMode = useQueryParamStore((state) => state.embed === 'true');
  const showProjectDetails = useQueryParamStore(
    (state) => state.showProjectDetails
  );
  // A project has no sites if all site geometries are null.
  const hasProjectSites = useSingleProjectStore(
    (state) => !hasNoSites(state.singleProject?.sites)
  );
  const isInterventionSelected = useInterventionStore(
    (state) =>
      state.selectedSampleIntervention !== null ||
      state.selectedIntervention !== null
  );
  const interventions = useInterventionStore((state) => state.interventions);
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

  const canShowSatelliteToggle =
    !(isMobile && isInterventionSelected) && selectedTab === 'field';
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
    activeDropdown,
    setActiveDropdown,
  };

  const interventionDropDownProps = {
    allInterventions: AllInterventions,
    activeDropdown,
    setActiveDropdown,
    availableInterventionTypes,
  };
  const exitMapMode = () => {
    // Switching from map to list only changes the view mode. The current site
    // selection and its URL state are preserved.
    setSelectedMode('list');
  };

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
