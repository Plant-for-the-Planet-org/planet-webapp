import React, { useState } from 'react';
import style from './styles/ProjectListControls.module.scss';
import ProjectListTabForMobile from './microComponents/ProjectListTabForMobile';
import { SearchAndFilter } from './microComponents/ProjectSearchAndFilter';
import ViewModeTabs from './microComponents/ViewModeTabs';
import ClassificationDropDown from './microComponents/ClassificationDropDown';

import ActiveSearchField from './microComponents/ActiveSearchField';
import { TreeProjectClassification } from '@planet-sdk/common';
import { SetState } from '../../common/types/common';
import { MapProject } from '../../common/types/projectv2';
import { ProjectTabs } from '.';

interface ProjectListControlForMobileProps {
  projectCount: number | undefined;
  topProjectCount: number | undefined;
  setTabSelected: SetState<ProjectTabs>;
  tabSelected: ProjectTabs;
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  setDebouncedSearchValue: SetState<string>;
  selectedMode: 'list' | 'map';
  setSelectedMode: SetState<'list' | 'map'>;
  isMobile: boolean;
  searchProjectResults: MapProject[] | null;
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
}: ProjectListControlForMobileProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
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
  };
  return (
    <>
      {isSearching ? (
        <div className={style.searchFieldAndViewTabsContainer}>
          <ActiveSearchField {...activeSearchFieldProps} />
          <ViewModeTabs {...viewModeTabsProps} />
        </div>
      ) : (
        <div className={style.projectListControlsMobile}>
          <ProjectListTabForMobile {...tabProps} />
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
