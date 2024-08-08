import { useCallback, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslations } from 'next-intl';
import ProjectSnippet from './ProjectSnippet';
import style from './ProjectsSection.module.scss';
import { useProjects } from './ProjectsContext';
import ProjectListControls from './ProjectListControls';
import { MapProject } from '../common/types/ProjectPropsContextInterface';
import ProjectListControlForMobile from './ProjectListControls/ProjectListControlForMobile';
import NoProjectFound from '../../../public/assets/images/icons/projectV2/NoProjectFound';
import { SetState } from '../common/types/common';

interface ProjectsSectionProps {
  selectedMode: 'list' | 'map';
  setSelectedMode: SetState<'list' | 'map'>;
  isMobile: boolean;
}

const ProjectsSection = ({
  selectedMode,
  setSelectedMode,
  isMobile,
}: ProjectsSectionProps) => {
  const {
    projects,
    filteredTopProjects,
    filteredRegularProjects,
    selectedClassification,
    setSelectedClassification,
    searchProjectResults,
    setTabSelected,
    topProjects,
    debouncedSearchValue,
    setDebouncedSearchValue,
    isLoading,
    isError,
    tabSelected,
    doSearchResultsMatchFilters,
  } = useProjects();
  const tAllProjects = useTranslations('AllProjects');

  const projectsToDisplay = useMemo(() => {
    const isTopProjectTab = tabSelected === 0 || tabSelected === 'topProjects';
    const hasClassificationFilter = selectedClassification.length > 0;
    const isSearching = searchProjectResults && debouncedSearchValue;

    if (isSearching) {
      if (hasClassificationFilter && doSearchResultsMatchFilters) {
        return searchProjectResults;
      } else if (hasClassificationFilter && !doSearchResultsMatchFilters) {
        return [];
      } else {
        return searchProjectResults;
      }
    }
    if (hasClassificationFilter) {
      return isTopProjectTab ? filteredTopProjects : filteredRegularProjects;
    }
    //* Default case: return either top projects or all projects based on the selected tab
    return isTopProjectTab ? topProjects : projects;
  }, [
    tabSelected,
    selectedMode,
    selectedClassification,
    filteredTopProjects,
    topProjects,
    filteredRegularProjects,
    searchProjectResults,
    doSearchResultsMatchFilters,
  ]);

  const renderProjectSnippet = useCallback(
    (project: MapProject) => (
      <ProjectSnippet
        key={project.properties.id}
        project={project.properties}
        showPopup={true}
      />
    ),
    []
  );
  if (isLoading || isError) {
    return <Skeleton className={style.projectSectionSkeleton} />;
  }
  const projectCount = selectedClassification.length
    ? filteredRegularProjects?.length
    : projects?.length;

  const topProjectCount = selectedClassification.length
    ? filteredTopProjects?.length
    : topProjects?.length;

  const isProjectFound = !(
    (projectsToDisplay?.length === 0 && debouncedSearchValue.length > 0) ||
    projectsToDisplay?.length === 0
  );

  const commonProps = {
    projectCount,
    topProjectCount,
    tabSelected,
    setTabSelected,
    selectedClassification,
    setSelectedClassification,
    setDebouncedSearchValue,
    searchProjectResults,
  };
  const projectListControlMobileProps = {
    setSelectedMode,
    selectedMode,
    isMobile,
  };

  return (
    <>
      {isMobile ? (
        <ProjectListControlForMobile
          {...commonProps}
          {...projectListControlMobileProps}
        />
      ) : (
        <ProjectListControls {...commonProps} />
      )}

      <div className={style.projectList}>
        {isProjectFound ? (
          projectsToDisplay
            ?.sort(
              (a, b) =>
                Number(b.properties.allowDonations) -
                Number(a.properties.allowDonations)
            )
            .map(renderProjectSnippet)
        ) : (
          <div className={style.noProjectFoundContainer}>
            <NoProjectFound />
            <p className={style.noProjectFoundText}>
              {tAllProjects('noProjectFound')}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsSection;
