import React, { useState } from 'react';
import style from './Search.module.scss';
import ProjectListTabForMobile from './ProjectListTabForMobile';
import ProjectSearchAndFilter from './ProjectSearchAndFilter';
import ViewModeTabs from './ViewModeTabs';
import { FilterDropDown } from './Filter';
import { ProjectListControlsProps } from '.';
import ActiveSearchField from './ActiveSearchField';

const ProjectListControlForMobile = ({
  filterApplied,
  setFilterApplied,
  availableFilters,
  projectCount,
  topProjectCount,
}: ProjectListControlsProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [tabSelected, setTabSelected] = useState<'topProjects' | 'allProjects'>(
    'topProjects'
  );
  return (
    <>
      <div className={style.searchTabForMobile}>
        {isSearching ? (
          <div className={style.searchBarMainContainer}>
            <ActiveSearchField
              setIsFilterOpen={setIsFilterOpen}
              setIsSearching={setIsSearching}
            />
          </div>
        ) : (
          <>
            <ProjectListTabForMobile
              projectCount={projectCount}
              topProjectCount={topProjectCount}
              tabSelected={tabSelected}
              setTabSelected={setTabSelected}
              setIsFilterOpen={setIsFilterOpen}
            />
            <ProjectSearchAndFilter
              setIsFilterOpen={setIsFilterOpen}
              isFilterOpen={isFilterOpen}
              setIsSearching={setIsSearching}
              isSearching={isSearching}
            />
            <ViewModeTabs setIsFilterOpen={setIsFilterOpen} />
          </>
        )}
      </div>
      {isFilterOpen && (
        <FilterDropDown
          filterApplied={filterApplied}
          setFilterApplied={setFilterApplied}
          availableFilters={availableFilters}
        />
      )}
    </>
  );
};

export default ProjectListControlForMobile;
