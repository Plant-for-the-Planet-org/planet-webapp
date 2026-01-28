import type { CategorizedProjects } from './ProjectMarkers';

import { useMemo } from 'react';
import ProjectMarkers from './ProjectMarkers';
import { useProjects } from '../ProjectsContext';
import { getProjectCategory } from '../../../utils/projectV2';
import { useFilteredProjects } from '../../../hooks/useFilteredProjects';

const MultipleProjectsView = () => {
  const { isError } = useProjects();
  const { filteredProjectCount, filteredProjects } = useFilteredProjects();

  const categorizedProjects = useMemo(() => {
    if (filteredProjectCount === 0) {
      return {
        topApprovedProjects: [],
        nonDonatableProjects: [],
        regularDonatableProjects: [],
      };
    }

    return filteredProjects.reduce<CategorizedProjects>(
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

  if (isError) return null;

  return <ProjectMarkers categorizedProjects={categorizedProjects} />;
};

export default MultipleProjectsView;
