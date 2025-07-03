import type { CategorizedProjects } from './ProjectMarkers';

import { useMemo } from 'react';
import ProjectMarkers from './ProjectMarkers';
import { useProjects } from '../ProjectsContext';
import { getProjectCategory } from '../../../utils/projectV2';

interface MultipleProjectsViewProps {
  page: 'project-list' | 'project-details';
}

const MultipleProjectsView = ({ page }: MultipleProjectsViewProps) => {
  const { isError, filteredProjects } = useProjects();
  if (isError || !filteredProjects) return null;

  const categorizedProjects = useMemo(() => {
    return filteredProjects?.reduce<CategorizedProjects>(
      (categorizedProjects, project) => {
        const projectCategory = getProjectCategory(project.properties);
        switch (projectCategory) {
          case 'topProject':
            categorizedProjects.topApprovedProjects.push(project);
            break;
          case 'regularProject':
            categorizedProjects.regularDonatableProjects.push(project);
            break;
          case 'nonDonatableProject':
            categorizedProjects.nonDonatableProjects.push(project);
            break;
        }
        return categorizedProjects;
      },
      {
        topApprovedProjects: [],
        nonDonatableProjects: [],
        regularDonatableProjects: [],
      }
    );
  }, [filteredProjects]);

  return (
    <ProjectMarkers categorizedProjects={categorizedProjects} page={page} />
  );
};

export default MultipleProjectsView;
