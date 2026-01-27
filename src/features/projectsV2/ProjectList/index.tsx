import type { MapProject } from '../../common/types/projectv2';
import type { ProjectTabs } from '../ProjectListControls';

import { useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../ProjectsSection.module.scss';
import NoDataFound from '../../../../public/assets/images/icons/projectV2/NoDataFound';
import { useProjects } from '../ProjectsContext';
import ProjectSnippet from '../ProjectSnippet';
import { useProjectStore } from '../../../stores';

const ProjectList = ({ tabSelected }: { tabSelected: ProjectTabs }) => {
  const tAllProjects = useTranslations('AllProjects');
  const {
    debouncedSearchValue,
    selectedClassification,
    filteredProjects,
    showDonatableProjects,
    topProjects,
  } = useProjects();
  // store: state
  const projects = useProjectStore((state) => state.projects);

  const projectsToDisplay = useMemo(() => {
    const hasFilterOrSearchApplied =
      debouncedSearchValue !== '' ||
      selectedClassification.length > 0 ||
      showDonatableProjects;
    if (hasFilterOrSearchApplied) return filteredProjects;
    return tabSelected === 'topProjects' ? topProjects : projects;
  }, [filteredProjects, tabSelected]);

  const sortedProjects = useMemo(() => {
    return projectsToDisplay?.sort((a, b) => {
      if (a.properties.allowDonations === b.properties.allowDonations) return 0;
      return a.properties.allowDonations ? -1 : 1;
    });
  }, [projectsToDisplay]);

  const renderProjectSnippet = useCallback(
    (project: MapProject) => (
      <ProjectSnippet
        key={project.properties.id}
        project={project.properties}
        showTooltipPopups={true}
      />
    ),
    []
  );

  const isProjectFound = !(projectsToDisplay?.length === 0);
  return (
    <div className={styles.projectList}>
      {isProjectFound ? (
        sortedProjects?.map(renderProjectSnippet)
      ) : (
        <div className={styles.noProjectFoundContainer}>
          <NoDataFound />
          <p className={styles.noProjectFoundText}>
            {tAllProjects('noProjectFound')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
