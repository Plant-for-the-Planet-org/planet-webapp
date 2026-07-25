import type { SetState } from '../../common/types/common';
import type { ProjectTabs } from '.';
import type { MapOptions } from '../../common/types/map';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './styles/ProjectListControls.module.scss';
import ProjectListTabForMobile from './microComponents/ProjectListTabForMobile';
import { SearchAndFilter } from './microComponents/ProjectSearchAndFilter';
import ViewModeTabs from './microComponents/ViewModeTabs';
import ClassificationDropDown from './microComponents/ClassificationDropDown';
import ActiveSearchField from './microComponents/ActiveSearchField';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import MapFeatureExplorer from '../ProjectsMap/MapFeatureExplorer';
import { clsx } from 'clsx';
import { useQueryParamStore } from '../../../stores/queryParamStore';
import { useProjectStore, useViewStore } from '../../../stores';
import { useFilteredProjects } from '../../../hooks/useFilteredProjects';

interface ProjectListControlForMobileProps {
  tabSelected?: ProjectTabs;
  setTabSelected?: SetState<ProjectTabs>;
  isMobile: boolean;
  mapOptions: MapOptions;
  updateMapOption: (option: keyof MapOptions, value: boolean) => void;
  shouldHideProjectTabs?: boolean;
}

const ProjectListControlForMobile = ({
  tabSelected,
  setTabSelected,
  isMobile,
  mapOptions,
  updateMapOption,
  shouldHideProjectTabs,
}: ProjectListControlForMobileProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const tAllProjects = useTranslations('AllProjects');
  const { isImpersonationModeOn } = useUserProps();
  const { filteredProjectCount } = useFilteredProjects();
  //store: state
  const isEmbedMode = useQueryParamStore((state) => state.embed === 'true');
  const showProjectList = useQueryParamStore((state) => state.showProjectList);
  const selectedMode = useViewStore((state) => state.selectedMode);
  const currentPage = useViewStore((state) => state.page);
  const isFilterApplied = useProjectStore(
    (state) =>
      state.selectedClassification.length > 0 || state.showDonatableProjects
  );
  const isSearching = useProjectStore((state) => state.isSearching);

  const shouldDisplayFilterResults = isFilterApplied && selectedMode !== 'map';
  const shouldDisplayProjectListTab =
    !isFilterApplied && selectedMode !== 'map' && !shouldHideProjectTabs;
  const onlyMapModeAllowed =
    isEmbedMode &&
    currentPage === 'project-list' &&
    showProjectList === 'false';
  const shouldDisplayMapFeatureExplorer =
    selectedMode === 'map' && process.env.ENABLE_EXPLORE === 'true';

  const projectListControlsMobileClasses = clsx(
    styles.projectListControlsMobile,
    {
      [styles.mapModeControls]: selectedMode === 'map',
      [styles.impersonationMode]: isImpersonationModeOn,
    }
  );

  const tabContainerClasses = clsx(styles.tabsContainer, {
    [styles.impersonationMode]: isImpersonationModeOn,
  });

  return (
    <>
      {isSearching ? (
        <div className={tabContainerClasses}>
          <ActiveSearchField setIsFilterOpen={setIsFilterOpen} />
          {!onlyMapModeAllowed && (
            <ViewModeTabs setIsFilterOpen={setIsFilterOpen} />
          )}
        </div>
      ) : (
        <div className={projectListControlsMobileClasses}>
          {shouldDisplayFilterResults && filteredProjectCount > 0 && (
            <div className={styles.filterResultContainerMobile}>
              {tAllProjects('filterResult', {
                count: filteredProjectCount,
              })}
            </div>
          )}
          {shouldDisplayProjectListTab && (
            <ProjectListTabForMobile
              tabSelected={tabSelected}
              setTabSelected={setTabSelected}
              setIsFilterOpen={setIsFilterOpen}
            />
          )}
          <SearchAndFilter
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            isMobile={isMobile}
          />
          {shouldDisplayMapFeatureExplorer && (
            <MapFeatureExplorer
              mapOptions={mapOptions}
              updateMapOption={updateMapOption}
              isMobile={true}
            />
          )}
          {!onlyMapModeAllowed && (
            <ViewModeTabs setIsFilterOpen={setIsFilterOpen} />
          )}
        </div>
      )}
      {isFilterOpen && !isSearching && <ClassificationDropDown />}
    </>
  );
};

export default ProjectListControlForMobile;
