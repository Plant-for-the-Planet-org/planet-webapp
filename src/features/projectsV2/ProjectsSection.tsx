import { useCallback, useEffect, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslations } from 'next-intl';
import ProjectSnippet from './ProjectSnippet';
import style from './ProjectsSection.module.scss';
import { useProjects } from './ProjectsContext';
import ProjectListControls from './ProjectListControls';
import { MapProject } from '../common/types/ProjectPropsContextInterface';
import ProjectListControlForMobile from './ProjectListControls/ProjectListControlForMobile';
import { getSearchProjects } from './ProjectListControls/utils';
import NoProjectFound from '../../../public/assets/images/icons/projectV2/NoProjectFound';
import { SetState } from '../common/types/common';

interface ProjectsSectionProps {
  selectedMode: 'list' | 'map';
  setSelectedMode: SetState<'list' | 'map'>;
}

const ProjectsSection = ({
  selectedMode,
  setSelectedMode,
}: ProjectsSectionProps) => {
  const {
    projects,
    topFilteredProjects,
    regularFilterProjects,
    selectedClassification,
    setSelectedClassification,
    searchProjectResults,
    setTabSelected,
    topProjects,
    debouncedSearchValue,
    setDebouncedSearchValue,
    isLoading,
    isError,
    isMobile,
    tabSelected,
  } = useProjects();
  const tAllProjects = useTranslations('AllProjects');
  const projectsToDisplay = useMemo(() => {
    // If the user is searching for a project, return the search results
    if (searchProjectResults && debouncedSearchValue) {
      return searchProjectResults;
    }
    // If a classification filter is applied, return the filtered projects based on the selected tab
    if (selectedClassification.length > 0) {
      return tabSelected === 0 || tabSelected === 'topProjects'
        ? topFilteredProjects
        : regularFilterProjects;
    }
    // Default case: return either top projects or all projects based on the selected tab
    return tabSelected === 0 || tabSelected === 'topProjects'
      ? topProjects
      : projects;
  }, [
    tabSelected,
    selectedMode,
    selectedClassification,
    topFilteredProjects,
    topProjects,
    regularFilterProjects,
    searchProjectResults,
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
    ? regularFilterProjects?.length
    : projects?.length;

  const topProjectCount = selectedClassification.length
    ? topFilteredProjects?.length
    : topProjects?.length;

  const isNoProjectFound =
    (projectsToDisplay?.length === 0 && debouncedSearchValue.length > 0) ||
    projectsToDisplay?.length === 0;

  const projectControlProps = {
    projectCount,
    topProjectCount,
    tabSelected,
    setTabSelected,
    selectedClassification,
    setSelectedClassification,
    setDebouncedSearchValue,
  };

  return (
    <>
      {isMobile ? (
        <ProjectListControlForMobile
          {...projectControlProps}
          setSelectedMode={setSelectedMode}
          selectedMode={selectedMode}
        />
      ) : (
        <ProjectListControls {...projectControlProps} />
      )}

      <div className={style.projectList}>
        {!isNoProjectFound ? (
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
