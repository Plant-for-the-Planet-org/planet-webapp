import type { SetState } from '../../common/types/common';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './styles/ProjectListControls.module.scss';
import ActiveSearchField from './microComponents/ActiveSearchField';
import ClassificationDropDown from './microComponents/ClassificationDropDown';
import ProjectListTabLargeScreen from './microComponents/ProjectListTabLargeScreen';
import { SearchAndFilter } from './microComponents/ProjectSearchAndFilter';
import { useProjectStore } from '../../../stores';
import { useFilteredProjects } from '../../../hooks/useFilteredProjects';

export type ProjectTabs = 'topProjects' | 'allProjects';

export interface ProjectListControlsProps {
  tabSelected: ProjectTabs;
  setTabSelected: SetState<ProjectTabs>;
  shouldHideProjectTabs: boolean;
}
const ProjectListControls = ({
  setTabSelected,
  tabSelected,
  shouldHideProjectTabs,
}: ProjectListControlsProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const tAllProjects = useTranslations('AllProjects');
  const tCommon = useTranslations('Common');
  const { filteredProjectCount } = useFilteredProjects();

  const isFilterApplied = useProjectStore(
    (state) =>
      state.showDonatableProjects || state.selectedClassification.length > 0
  );
  const isSearching = useProjectStore((state) => state.isSearching);

  const renderTabContent = useMemo(() => {
    if (isFilterApplied) {
      return (
        <div className={styles.filterResultContainer}>
          {tAllProjects('filterResult', {
            count: filteredProjectCount,
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

    return (
      <ProjectListTabLargeScreen
        setIsFilterOpen={setIsFilterOpen}
        tabSelected={tabSelected}
        setTabSelected={setTabSelected}
      />
    );
  }, [
    isFilterApplied,
    shouldHideProjectTabs,
    filteredProjectCount,
    tabSelected,
  ]);

  return (
    <>
      {isSearching ? (
        <ActiveSearchField setIsFilterOpen={setIsFilterOpen} />
      ) : (
        <div className={styles.projectListControls}>
          {renderTabContent}
          <SearchAndFilter
            setIsFilterOpen={setIsFilterOpen}
            isFilterOpen={isFilterOpen}
          />
        </div>
      )}

      <div className={styles.filterDropDownContainer}>
        {isFilterOpen && !isSearching && <ClassificationDropDown />}
      </div>
    </>
  );
};

export default ProjectListControls;
