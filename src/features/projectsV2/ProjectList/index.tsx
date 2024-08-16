import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import styles from '../ProjectsSection.module.scss';
import NoProjectFound from '../../../../public/assets/images/icons/projectV2/NoProjectFound';
import { useProjects } from '../ProjectsContext';
import ProjectSnippet from '../ProjectSnippet';
import { MapProject } from '../../common/types/projectv2';

const ProjectList = () => {
  const tAllProjects = useTranslations('AllProjects');
  const {
    debouncedSearchValue,
    selectedClassification,
    filteredProjects,
    tabSelected,
    topProjects,
    projects,
  } = useProjects();
  const ProjectsToDisplay = useMemo(() => {
    const hasClassificationOrSearch =
      debouncedSearchValue !== '' || selectedClassification.length > 0;
    if (hasClassificationOrSearch) return filteredProjects;
    return tabSelected === 'topProjects' ? topProjects : projects;
  }, [filteredProjects, tabSelected]);

  const sortedProjects = useMemo(() => {
    return ProjectsToDisplay?.sort((a, b) => {
      return (
        Number(b.properties.allowDonations) -
        Number(a.properties.allowDonations)
      );
    });
  }, [ProjectsToDisplay]);

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

  const isProjectFound = !(ProjectsToDisplay?.length === 0);
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
