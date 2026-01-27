import type { TreeProjectClassification } from '@planet-sdk/common';
import type { SetState } from '../../common/types/common';
import type { ProjectTabs } from '.';
import type { MapProject } from '../../common/types/projectv2';
import type { MapOptions } from '../../common/types/map';
import type { Page } from '../../../stores/viewStore';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './styles/ProjectListControls.module.scss';
import ProjectListTabForMobile from './microComponents/ProjectListTabForMobile';
import { SearchAndFilter } from './microComponents/ProjectSearchAndFilter';
import ViewModeTabs from './microComponents/ViewModeTabs';
import ClassificationDropDown from './microComponents/ClassificationDropDown';
import ActiveSearchField from './microComponents/ActiveSearchField';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import MapFeatureExplorer from '../ProjectsMap/MapFeatureExplorer';
import { clsx } from 'clsx';
import { useQueryParamStore } from '../../../stores/queryParamStore';
import { useViewStore } from '../../../stores';

interface ProjectListControlForMobileProps {
  projectCount: number | undefined;
  topProjectCount: number | undefined;
  tabSelected?: ProjectTabs;
  setTabSelected?: SetState<ProjectTabs>;
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  debouncedSearchValue: string;
  setDebouncedSearchValue: SetState<string>;
  isSearching: boolean;
  setIsSearching: SetState<boolean>;
  isMobile: boolean;
  filteredProjects: MapProject[] | undefined;
  mapOptions: MapOptions;
  updateMapOption: (option: keyof MapOptions, value: boolean) => void;
  shouldHideProjectTabs?: boolean;
  showDonatableProjects: boolean;
  setShowDonatableProjects: SetState<boolean>;
  currentPage: Page;
}

const ProjectListControlForMobile = ({
  projectCount,
  topProjectCount,
  filteredProjects,
  tabSelected,
  setTabSelected,
  debouncedSearchValue,
  setDebouncedSearchValue,
  selectedClassification,
  setSelectedClassification,
  isMobile,
  isSearching,
  setIsSearching,
  mapOptions,
  updateMapOption,
  shouldHideProjectTabs,
  showDonatableProjects,
  setShowDonatableProjects,
  currentPage,
}: ProjectListControlForMobileProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const tAllProjects = useTranslations('AllProjects');
  const { isImpersonationModeOn } = useUserProps();

  const isEmbedMode = useQueryParamStore((state) => state.embed === 'true');
  const showProjectList = useQueryParamStore((state) => state.showProjectList);
  const selectedMode = useViewStore((state) => state.selectedMode);

  const hasFilterApplied =
    selectedClassification.length > 0 || showDonatableProjects;
  const shouldDisplayFilterResults = hasFilterApplied && selectedMode !== 'map';
  const shouldDisplayProjectListTab =
    !hasFilterApplied && selectedMode !== 'map' && !shouldHideProjectTabs;
  const onlyMapModeAllowed =
    isEmbedMode &&
    currentPage === 'project-list' &&
    showProjectList === 'false';
  const shouldDisplayMapFeatureExplorer =
    selectedMode === 'map' && process.env.ENABLE_EXPLORE === 'true';

  const projectListControlsMobileClasses = clsx(
    styles.projectListControlsMobile,
    {
      [styles.mapModeControls]: selectedMode === 'map',
      [styles.impersonationMode]: isImpersonationModeOn,
    }
  );

  const tabContainerClasses = clsx(styles.tabsContainer, {
    [styles.impersonationMode]: isImpersonationModeOn,
  });

  const activeSearchFieldProps = {
    setIsFilterOpen,
    setIsSearching,
    debouncedSearchValue,
    setDebouncedSearchValue,
  };
  const viewModeTabsProps = {
    setIsFilterOpen,
    isSearching,
    selectedMode,
  };
  const tabProps = {
    projectCount,
    topProjectCount,
    tabSelected,
    setTabSelected,
    setIsFilterOpen,
  };
  const listControlProps = {
    hasFilterApplied,
    isFilterOpen,
    setIsFilterOpen,
    isSearching,
    setIsSearching,
    isMobile,
    selectedMode,
  };

  const classificationDropDownProps = {
    selectedClassification,
    setSelectedClassification,
    selectedMode,
    showDonatableProjects,
    setShowDonatableProjects,
  };

  return (
    <>
      {isSearching ? (
        <div className={tabContainerClasses}>
          <ActiveSearchField {...activeSearchFieldProps} />
          {!onlyMapModeAllowed && <ViewModeTabs {...viewModeTabsProps} />}
        </div>
      ) : (
        <div className={projectListControlsMobileClasses}>
          {shouldDisplayFilterResults &&
            filteredProjects &&
            filteredProjects?.length > 0 && (
              <div className={styles.filterResultContainerMobile}>
                {tAllProjects('filterResult', {
                  count: filteredProjects?.length,
                })}
              </div>
            )}
          {shouldDisplayProjectListTab && (
            <ProjectListTabForMobile {...tabProps} />
          )}
          <SearchAndFilter {...listControlProps} />
          {shouldDisplayMapFeatureExplorer && (
            <MapFeatureExplorer
              mapOptions={mapOptions}
              updateMapOption={updateMapOption}
              isMobile={true}
            />
          )}
          {!onlyMapModeAllowed && <ViewModeTabs {...viewModeTabsProps} />}
        </div>
      )}
      {isFilterOpen && !isSearching && (
        <ClassificationDropDown {...classificationDropDownProps} />
      )}
    </>
  );
};

export default ProjectListControlForMobile;
