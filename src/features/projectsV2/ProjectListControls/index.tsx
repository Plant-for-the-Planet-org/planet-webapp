import { useState } from 'react';
import style from './styles/ProjectListControls.module.scss';
import ActiveSearchField from './microComponents/ActiveSearchField';
import ClassificationDropDown from './microComponents/ClassificationDropDown';
import ProjectListTabLargeScreen from './microComponents/ProjectListTabLargeScreen';
import { SearchAndFilter } from './microComponents/ProjectSearchAndFilter';
import { SetState } from '../../common/types/common';
import { TreeProjectClassification } from '@planet-sdk/common';

export interface ProjectListControlsProps {
  filterApplied?: TreeProjectClassification | undefined;
  setFilterApplied?: (newValue: TreeProjectClassification | undefined) => void;
  projectCount: number | undefined;
  topProjectCount: number | undefined;
  setTabSelected: SetState<number>;
  tabSelected: number;
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  setDebouncedSearchValue: SetState<string>;
  isSearching: boolean;
  setIsSearching: SetState<boolean>;
}
const ProjectListControls = ({
  projectCount,
  topProjectCount,
  setTabSelected,
  tabSelected,
  selectedClassification,
  setSelectedClassification,
  setDebouncedSearchValue,
  isSearching,
  setIsSearching,
}: ProjectListControlsProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const projectListTabProps = {
    setIsFilterOpen,
    topProjectCount,
    projectCount,
    setTabSelected,
    tabSelected,
  };

  const searchAndFilterProps = {
    setIsFilterOpen,
    isFilterOpen,
    selectedClassification,
    isSearching,
    setIsSearching,
  };
  return (
    <>
      {isSearching ? (
        <ActiveSearchField
          setIsSearching={setIsSearching}
          setIsFilterOpen={setIsFilterOpen}
          setDebouncedSearchValue={setDebouncedSearchValue}
          setSelectedClassification={setSelectedClassification}
        />
      ) : (
        <div className={style.projectListControls}>
          <ProjectListTabLargeScreen {...projectListTabProps} />
          <SearchAndFilter {...searchAndFilterProps} />
        </div>
      )}

      <div className={style.filterDropDownContainer}>
        {isFilterOpen && !isSearching && (
          <ClassificationDropDown
            selectedClassification={selectedClassification}
            setSelectedClassification={setSelectedClassification}
          />
        )}
      </div>
    </>
  );
};

export default ProjectListControls;
