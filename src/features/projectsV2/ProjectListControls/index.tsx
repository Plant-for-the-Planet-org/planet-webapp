import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './styles/ProjectListControls.module.scss';
import ActiveSearchField from './microComponents/ActiveSearchField';
import ClassificationDropDown from './microComponents/ClassificationDropDown';
import ProjectListTabLargeScreen from './microComponents/ProjectListTabLargeScreen';
import { SearchAndFilter } from './microComponents/ProjectSearchAndFilter';
import { SetState } from '../../common/types/common';
import { TreeProjectClassification } from '@planet-sdk/common';
import { MapProject } from '../../common/types/projectv2';
import { ViewMode } from '../../../../pages/_app';

export type ProjectTabs = number | 'topProjects' | 'allProjects';
export interface ProjectListControlsProps {
  filterApplied?: TreeProjectClassification | undefined;
  setFilterApplied?: (newValue: TreeProjectClassification | undefined) => void;
  projectCount: number | undefined;
  topProjectCount: number | undefined;
  setTabSelected: SetState<ProjectTabs>;
  tabSelected: ProjectTabs;
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  setDebouncedSearchValue: SetState<string>;
  searchProjectResults: MapProject[] | null;
  filteredProjects: MapProject[] | null | undefined;
}
const ProjectListControls = ({
  projectCount,
  topProjectCount,
  setTabSelected,
  tabSelected,
  selectedClassification,
  setSelectedClassification,
  setDebouncedSearchValue,
  searchProjectResults,
  filteredProjects,
}: ProjectListControlsProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const tAllProjects = useTranslations('AllProjects');

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
    searchProjectResults,
  };
  const activeSearchFieldProps = {
    setIsSearching,
    setIsFilterOpen,
    setDebouncedSearchValue,
  };
  const classificationDropDownProps = {
    selectedClassification,
    setSelectedClassification,
  };
  return (
    <>
      {isSearching ? (
        <ActiveSearchField {...activeSearchFieldProps} />
      ) : (
        <div className={styles.projectListControls}>
          {selectedClassification.length > 0 ? (
            <div className={styles.filterResultContainer}>
              {tAllProjects('filterResult', {
                count: filteredProjects?.length,
              })}
            </div>
          ) : (
            <ProjectListTabLargeScreen {...projectListTabProps} />
          )}
          <SearchAndFilter {...searchAndFilterProps} />
        </div>
      )}

      <div className={styles.filterDropDownContainer}>
        {isFilterOpen && !isSearching && (
          <ClassificationDropDown {...classificationDropDownProps} />
        )}
      </div>
    </>
  );
};

export default ProjectListControls;
