import { useState } from 'react';
import style from './ProjectListControls.module.scss';
import ActiveSearchField from './ActiveSearchField';
import ClassificationDropDown from './ClassificationDropDown';
import ProjectListTabLargeScreen from './ProjectListTabLargeScreen';
import { SearchAndFilter } from './ProjectSearchAndFilter';

export type Classification =
  | 'allProjects'
  | 'large-scale-planting'
  | 'agroforestry'
  | 'natural-regeneration'
  | 'managed-regeneration'
  | 'urban-planting'
  | 'other-planting';

export interface ProjectListControlsProps {
  filterApplied: Classification | undefined;
  setFilterApplied: (newValue: Classification | undefined) => void;
  availableFilters: Classification[];
  projectCount: number;
  topProjectCount: number;
}

const ProjectListControls = ({
  availableFilters,
  projectCount,
  topProjectCount,
}: ProjectListControlsProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState<
    Classification[]
  >([]);

  const projectListTabProps = {
    setIsFilterOpen,
    topProjectCount,
    projectCount,
  };

  const searchAndFilterProps = {
    setIsFilterOpen,
    isFilterOpen,
    setIsSearching,
    isSearching,
    selectedClassification,
  };

  return (
    <>
      <div className={style.projectListControls}>
        {isSearching ? (
          <ActiveSearchField
            setIsSearching={setIsSearching}
            setIsFilterOpen={setIsFilterOpen}
          />
        ) : (
          <>
            <ProjectListTabLargeScreen {...projectListTabProps} />
            <SearchAndFilter {...searchAndFilterProps} />
          </>
        )}
      </div>
      <div className={style.filterDropDownContainer}>
        {isFilterOpen && !isSearching && (
          <ClassificationDropDown
            selectedClassification={selectedClassification}
            setSelectedClassification={setSelectedClassification}
            availableFilters={availableFilters}
          />
        )}
      </div>
    </>
  );
};

export default ProjectListControls;
