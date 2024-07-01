import React, { useState } from 'react';
import style from '../Project/Search.module.scss';
import ProjectListTabForMobile from './ProjectListTabForMobile';
import ProjectSelectionFeatures from './ProjectSelectionFeatures';
import LocationListTabs from './LocationAndListTabs';
import { FilterDropDown } from './Filter';
import { Classification } from './Filter';

export interface SearchTabForMobileProps {
  filterApplied: Classification | undefined;
  setFilterApplied: (newValue: Classification | undefined) => void;
  availableFilters: Classification[];
  numberOfProject: number;
}

export const SearchTabForMobile = ({
  filterApplied,
  setFilterApplied,
  availableFilters,
  numberOfProject,
}: SearchTabForMobileProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tabSelected, setTabSelected] = useState<'topProjects' | 'allProjects'>(
    'topProjects'
  );
  return (
    <>
      <div className={style.searchTabForMobile}>
        <ProjectListTabForMobile
          numberOfProject={numberOfProject}
          tabSelected={tabSelected}
          setTabSelected={setTabSelected}
          setIsFilterOpen={setIsFilterOpen}
        />
        <ProjectSelectionFeatures
          setIsFilterOpen={setIsFilterOpen}
          isFilterOpen={isFilterOpen}
        />
        <LocationListTabs setIsFilterOpen={setIsFilterOpen} />
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

export default SearchTabForMobile;
