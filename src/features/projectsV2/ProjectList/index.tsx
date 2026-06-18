import type { MapProject } from '../../common/types/projectv2';
import type { ProjectTabs } from '../ProjectListControls';

import { useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../ProjectsSection.module.scss';
import NoDataFound from '../../../../public/assets/images/icons/projectV2/NoDataFound';
import ProjectSnippet from '../ProjectSnippet';
import { useProjectStore } from '../../../stores';
import { useFilteredProjects } from '../../../hooks/useFilteredProjects';

interface ProjectListProps {
  tabSelected: ProjectTabs;
}

const ProjectList = ({ tabSelected }: ProjectListProps) => {
  const tAllProjects = useTranslations('AllProjects');
  const { filteredProjects } = useFilteredProjects();
  // store: state
  const projects = useProjectStore((state) => state.projects);
  const topProjects = useProjectStore((state) => state.topProjects);
  const showDonatableProjects = useProjectStore(
    (state) => state.showDonatableProjects
  );
  const debouncedSearchValue = useProjectStore(
    (state) => state.debouncedSearchValue
  );
  const isClassificationSelected = useProjectStore(
    (state) => state.selectedClassification.length > 0
  );

  const projectsToDisplay = useMemo(() => {
    const hasFilterOrSearchApplied =
      debouncedSearchValue !== '' ||
      isClassificationSelected ||
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
