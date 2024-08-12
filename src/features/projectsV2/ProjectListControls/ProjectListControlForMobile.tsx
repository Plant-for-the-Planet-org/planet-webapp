import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './styles/ProjectListControls.module.scss';
import ProjectListTabForMobile from './microComponents/ProjectListTabForMobile';
import { SearchAndFilter } from './microComponents/ProjectSearchAndFilter';
import ViewModeTabs from './microComponents/ViewModeTabs';
import ClassificationDropDown from './microComponents/ClassificationDropDown';
import ActiveSearchField from './microComponents/ActiveSearchField';
import { TreeProjectClassification } from '@planet-sdk/common';
import { SetState } from '../../common/types/common';
import { MapProject } from '../../common/types/projectv2';
import { ProjectTabs } from '.';
import { ViewMode } from '../../../../pages/_app';

interface ProjectListControlForMobileProps {
  projectCount: number | undefined;
  topProjectCount: number | undefined;
  setTabSelected: SetState<ProjectTabs>;
  tabSelected: ProjectTabs;
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  setDebouncedSearchValue: SetState<string>;
  selectedMode: ViewMode;
  setSelectedMode: SetState<ViewMode>;
  isMobile: boolean;
  searchProjectResults: MapProject[] | null;
  resultantProjectCount?: number;
}
const ProjectListControlForMobile = ({
  projectCount,
  topProjectCount,
  setTabSelected,
  tabSelected,
  setDebouncedSearchValue,
  selectedClassification,
  setSelectedClassification,
  setSelectedMode,
  selectedMode,
  searchProjectResults,
  isMobile,
  resultantProjectCount,
}: ProjectListControlForMobileProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const tAllProjects = useTranslations('AllProjects');
  const activeSearchFieldProps = {
    setIsFilterOpen,
    setIsSearching,
    setDebouncedSearchValue,
  };
  const viewModeTabsProps = {
    setIsFilterOpen,
    isSearching,
    setSelectedMode,
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
    selectedClassification,
    setIsFilterOpen,
    isFilterOpen,
    setIsSearching,
    isSearching,
    searchProjectResults,
    isMobile,
  };
  const classificationDropDownProps = {
    selectedClassification,
    setSelectedClassification,
    isMobile,
    selectedMode,
  };
  const hasFilterApplied =
    selectedClassification.length > 0 ||
    (searchProjectResults && searchProjectResults?.length > 0);
  const shouldDisplayFilterResults = hasFilterApplied && selectedMode !== 'map';
  const shouldDisplayProjectListTab =
    !hasFilterApplied && selectedMode !== 'map';
  return (
    <>
      {isSearching ? (
        <div className={styles.searchFieldAndViewTabsContainer}>
          <ActiveSearchField {...activeSearchFieldProps} />
          <ViewModeTabs {...viewModeTabsProps} />
        </div>
      ) : (
        <div className={styles.projectListControlsMobile}>
          {shouldDisplayFilterResults &&
            resultantProjectCount !== undefined &&
            resultantProjectCount > 0 && (
              <div className={styles.filterResultContainerMobile}>
                {tAllProjects('filterResult', {
                  count: resultantProjectCount,
                })}
              </div>
            )}
          {shouldDisplayProjectListTab && (
            <ProjectListTabForMobile {...tabProps} />
          )}
          <SearchAndFilter {...listControlProps} />
          <ViewModeTabs {...viewModeTabsProps} />
        </div>
      )}
      {isFilterOpen && !isSearching && (
        <ClassificationDropDown {...classificationDropDownProps} />
      )}
    </>
  );
};

export default ProjectListControlForMobile;
