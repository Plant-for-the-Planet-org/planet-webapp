import React, { useState } from 'react';
import style from './styles/ProjectListControls.module.scss';
import ProjectListTabForMobile from './microComponents/ProjectListTabForMobile';
import { SearchAndFilter } from './microComponents/ProjectSearchAndFilter';
import ViewModeTabs from './microComponents/ViewModeTabs';
import ClassificationDropDown from './microComponents/ClassificationDropDown';

import ActiveSearchField from './microComponents/ActiveSearchField';
import { TreeProjectClassification } from '@planet-sdk/common';

interface ProjectListControlForMobileProps {
  projectCount: number | undefined;
  topProjectCount: number | undefined;
}
const ProjectListControlForMobile = ({
  projectCount,
  topProjectCount,
}: ProjectListControlForMobileProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState<
    TreeProjectClassification[]
  >([]);
  const [tabSelected, setTabSelected] = useState<'topProjects' | 'allProjects'>(
    'topProjects'
  );

  return (
    <>
      {isSearching ? (
        <div className={style.searchFieldAndViewTabsContainer}>
          <ActiveSearchField
            setIsFilterOpen={setIsFilterOpen}
            setIsSearching={setIsSearching}
          />
          <ViewModeTabs
            setIsFilterOpen={setIsFilterOpen}
            isSearching={isSearching}
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
