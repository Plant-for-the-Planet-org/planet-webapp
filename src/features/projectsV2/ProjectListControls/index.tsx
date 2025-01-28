import type { SetState } from '../../common/types/common';
import type { TreeProjectClassification } from '@planet-sdk/common';
import type { MapProject } from '../../common/types/projectv2';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './styles/ProjectListControls.module.scss';
import ActiveSearchField from './microComponents/ActiveSearchField';
import ClassificationDropDown from './microComponents/ClassificationDropDown';
import ProjectListTabLargeScreen from './microComponents/ProjectListTabLargeScreen';
import { SearchAndFilter } from './microComponents/ProjectSearchAndFilter';

export type ProjectTabs = 'topProjects' | 'allProjects';

export interface ProjectListControlsProps {
  projectCount: number | undefined;
  topProjectCount: number | undefined;
  tabSelected: ProjectTabs;
  setTabSelected: SetState<ProjectTabs>;
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  debouncedSearchValue: string;
  setDebouncedSearchValue: SetState<string>;
  filteredProjects: MapProject[] | undefined;
  shouldHideProjectTabs: boolean;
}
const ProjectListControls = ({
  projectCount,
  topProjectCount,
  setTabSelected,
  tabSelected,
  selectedClassification,
  setSelectedClassification,
  debouncedSearchValue,
  setDebouncedSearchValue,
  filteredProjects,
  shouldHideProjectTabs,
}: ProjectListControlsProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const tAllProjects = useTranslations('AllProjects');
  const tCommon = useTranslations('Common');
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
    debouncedSearchValue,
    setDebouncedSearchValue,
  };
  const classificationDropDownProps = {
    selectedClassification,
    setSelectedClassification,
  };

  const renderTabContent = useMemo(() => {
    if (hasFilterApplied) {
      return (
        <div className={styles.filterResultContainer}>
          {tAllProjects('filterResult', {
            count: filteredProjects?.length,
          })}
        </div>
      );
    }

    if (shouldHideProjectTabs) {
      return (
        <h2 className={styles.projectListHeaderText}>
          {tCommon('stopTalkingStartPlanting')}
        </h2>
      );
    }

    return <ProjectListTabLargeScreen {...projectListTabProps} />;
  }, [hasFilterApplied, shouldHideProjectTabs, filteredProjects, tabSelected]);

  return (
    <>
      {isSearching ? (
        <ActiveSearchField {...activeSearchFieldProps} />
      ) : (
        <div className={styles.projectListControls}>
          {renderTabContent}
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
