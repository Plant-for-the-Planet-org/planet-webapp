import React, { useState } from 'react';
import style from './Search.module.scss';
import ProjectListTabForMobile from './ProjectListTabForMobile';
import ProjectSearchAndFilter from './ProjectSearchAndFilter';
import ViewModeTabs from './ViewModeTabs';
import ClassificationDropDown from './ClassificationDropDown';
import { ProjectListControlsProps } from '.';
import ActiveSearchField from './ActiveSearchField';
import { Classification } from '.';

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
              selectedClassification={selectedClassification}
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
