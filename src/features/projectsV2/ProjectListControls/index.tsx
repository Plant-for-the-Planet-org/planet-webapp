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

export type ProjectTabs = 'topProjects' | 'allProjects';
export interface ProjectListControlsProps {
  projectCount: number | undefined;
  topProjectCount: number | undefined;
  tabSelected: ProjectTabs;
  setTabSelected: SetState<ProjectTabs>;
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  setDebouncedSearchValue: SetState<string>;
  filteredProjects: MapProject[] | undefined;
}
const ProjectListControls = ({
  projectCount,
  topProjectCount,
  setTabSelected,
  tabSelected,
  selectedClassification,
  setSelectedClassification,
  setDebouncedSearchValue,
  filteredProjects,
}: ProjectListControlsProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const tAllProjects = useTranslations('AllProjects');

  const hasFilterApplied = selectedClassification.length > 0;

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
    isSearching,
    setIsSearching,
    hasFilterApplied,
  };
  const activeSearchFieldProps = {
    setIsSearching,
    setIsFilterOpen,
    setDebouncedSearchValue,
  };
  const classificationDropDownProps = {
    selectedClassification,
    setSelectedClassification,
    filteredProjects,
  };

  return (
    <>
      {isSearching ? (
        <ActiveSearchField {...activeSearchFieldProps} />
      ) : (
        <div className={styles.projectListControls}>
          {hasFilterApplied ? (
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
