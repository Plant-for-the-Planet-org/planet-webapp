import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo } from 'react';
import styles from '../ProjectsSection.module.scss';
import NoProjectFound from '../../../../public/assets/images/icons/projectV2/NoProjectFound';
import { useProjects } from '../ProjectsContext';
import ProjectSnippet from '../ProjectSnippet';
import { MapProject } from '../../common/types/projectv2';
import { ViewMode } from '../../../../pages/_app';

type ProjectListProps = {
  selectedMode: ViewMode;
  handleResultantProjectCount: (value: MapProject[] | null) => void;
};

const ProjectList = ({
  selectedMode,
  handleResultantProjectCount,
}: ProjectListProps) => {
  const tAllProjects = useTranslations('AllProjects');
  const {
    tabSelected,
    selectedClassification,
    debouncedSearchValue,
    searchProjectResults,
    doSearchResultsMatchFilters,
    filteredProjects,
    topProjects,
    projects,
  } = useProjects();
  const projectsToDisplay = useMemo(() => {
    const isTopProjectTab = tabSelected === 0 || tabSelected === 'topProjects';
    const isFilterApplied = selectedClassification.length > 0;

    if (
      searchProjectResults &&
      searchProjectResults?.length > 0 &&
      debouncedSearchValue
    ) {
      if (isFilterApplied && doSearchResultsMatchFilters) {
        return searchProjectResults;
      } else if (isFilterApplied && !doSearchResultsMatchFilters) {
        return [];
      } else {
        return searchProjectResults;
      }
    }
    if (isFilterApplied) {
      return filteredProjects;
    }
    //* Default case: return either top projects or all projects based on the selected tab
    return isTopProjectTab ? topProjects : projects;
  }, [
    tabSelected,
    selectedMode,
    selectedClassification,
    topProjects,
    filteredProjects,
    searchProjectResults,
    doSearchResultsMatchFilters,
  ]);

  const sortedProjects = useMemo(() => {
    return projectsToDisplay?.sort((a, b) => {
      const donationComparsion =
        Number(b.properties.allowDonations) -
        Number(a.properties.allowDonations);

      if (donationComparsion !== 0) return donationComparsion;
      return (
        Number(b.properties.purpose === 'trees' && b.properties.isTopProject) -
        Number(a.properties.purpose === 'trees' && a.properties.isTopProject)
      );
    });
  }, [projectsToDisplay]);
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
  useEffect(() => {
    if (projectsToDisplay) handleResultantProjectCount(projectsToDisplay);
  }, [projectsToDisplay]);

  const isProjectFound = !(
    (projectsToDisplay?.length === 0 && debouncedSearchValue.length > 0) ||
    projectsToDisplay?.length === 0
  );
  return (
    <div className={styles.projectList}>
      {isProjectFound ? (
        sortedProjects?.map(renderProjectSnippet)
      ) : (
        <div className={styles.noProjectFoundContainer}>
          <NoProjectFound />
          <p className={styles.noProjectFoundText}>
            {tAllProjects('noProjectFound')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
