import React, { useState } from 'react';
import style from './ProjectListControls.module.scss';
import ProjectListTabForMobile from './ProjectListTabForMobile';
import { SearchAndFilter } from './ProjectSearchAndFilter';
import ViewModeTabs from './ViewModeTabs';
import ClassificationDropDown from './ClassificationDropDown';
import { ProjectListControlsProps , Classification } from '.';
import ActiveSearchField from './ActiveSearchField';

const ProjectListControlForMobile = ({
  availableFilters,
  projectCount,
  topProjectCount,
}: ProjectListControlsProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState<
    Classification[]
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
          availableFilters={availableFilters}
        />
      )}
    </>
  );
};

export default ProjectListControlForMobile;
