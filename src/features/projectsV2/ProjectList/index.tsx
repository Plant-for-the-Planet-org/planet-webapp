import type { MapProject } from '../../common/types/projectv2';
import type { ProjectTabs } from '../ProjectListControls';

import { useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../ProjectsSection.module.scss';
import NoDataFound from '../../../../public/assets/images/icons/projectV2/NoDataFound';
import { Virtuoso } from 'react-virtuoso';
import { useProjects } from '../ProjectsContext';
import ProjectSnippet from '../ProjectSnippet';

const ProjectList = ({ tabSelected }: { tabSelected: ProjectTabs }) => {
  const tAllProjects = useTranslations('AllProjects');
  const {
    debouncedSearchValue,
    selectedClassification,
    filteredProjects,
    showDonatableProjects,
    topProjects,
    projects,
  } = useProjects();
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
        page="project-list"
      />
    ),
    []
  );

  const isProjectFound = !(projectsToDisplay?.length === 0);

  if (!isProjectFound) {
    return (
      <div className={styles.projectList}>
        <div className={styles.noProjectFoundContainer}>
          <NoDataFound />
          <p className={styles.noProjectFoundText}>
            {tAllProjects('noProjectFound')}
          </p>
        </div>
      </div>
    );
  }

  // Virtualized so only the cards near the viewport mount (was ~259 at once).
  return (
    <Virtuoso
      className={styles.projectList}
      data={sortedProjects ?? []}
      computeItemKey={(_, project) => project.properties.id}
      itemContent={(_, project) => (
        <div style={{ paddingBottom: 12 }}>{renderProjectSnippet(project)}</div>
      )}
      overscan={600} // px; ~3 cards above and below viewport to avoid sudden appearance while scrolling
      components={{
        Footer: () => <div style={{ height: 53 }} />,
      }}
    />
  );
};

export default ProjectList;
