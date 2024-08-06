import React, { useState } from 'react';
import style from './styles/ProjectListControls.module.scss';
import ProjectListTabForMobile from './microComponents/ProjectListTabForMobile';
import { SearchAndFilter } from './microComponents/ProjectSearchAndFilter';
import ViewModeTabs from './microComponents/ViewModeTabs';
import ClassificationDropDown from './microComponents/ClassificationDropDown';

import ActiveSearchField from './microComponents/ActiveSearchField';
import { TreeProjectClassification } from '@planet-sdk/common';
import { SetState } from '../../common/types/common';

interface ProjectListControlForMobileProps {
  projectCount: number | undefined;
  topProjectCount: number | undefined;
  setTabSelected: SetState<number | 'topProjects' | 'allProjects'>;
  tabSelected: number | 'topProjects' | 'allProjects';
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  setDebouncedSearchValue: SetState<string>;
  setSelectedMode: SetState<'list' | 'map'>;
  selectedMode: 'list' | 'map';
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
}: ProjectListControlForMobileProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  return (
    <>
      {isSearching ? (
        <div className={style.searchFieldAndViewTabsContainer}>
          <ActiveSearchField
            setIsFilterOpen={setIsFilterOpen}
            setIsSearching={setIsSearching}
            setDebouncedSearchValue={setDebouncedSearchValue}
            setSelectedClassification={setSelectedClassification}
          />
          <ViewModeTabs
            setIsFilterOpen={setIsFilterOpen}
            isSearching={isSearching}
            setSelectedMode={setSelectedMode}
            selectedMode={selectedMode}
          />
        </div>
      ) : (
        <div className={style.projectListControlsMobile}>
          <ProjectListTabForMobile
            projectCount={projectCount}
            topProjectCount={topProjectCount}
            tabSelected={tabSelected}
            setTabSelected={setTabSelected}
            setIsFilterOpen={setIsFilterOpen}
          />
          <SearchAndFilter
            selectedClassification={selectedClassification}
            setIsFilterOpen={setIsFilterOpen}
            isFilterOpen={isFilterOpen}
            setIsSearching={setIsSearching}
            isSearching={isSearching}
          />
          <ViewModeTabs
            setIsFilterOpen={setIsFilterOpen}
            isSearching={isSearching}
            setSelectedMode={setSelectedMode}
            selectedMode={selectedMode}
          />
        </div>
      )}
      {isFilterOpen && !isSearching && (
        <ClassificationDropDown
          selectedClassification={selectedClassification}
          setSelectedClassification={setSelectedClassification}
        />
      )}
    </>
  );
};

export default ProjectListControlForMobile;
