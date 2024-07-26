import { useMemo } from 'react';
import { useProjects } from '../ProjectsContext';
import ProjectMarkers, { CategorizedProjects } from './ProjectMarkers';
import { getProjectType } from './utils';

const MultipleProjectsView = () => {
  const { projects, isLoading, isError } = useProjects();

  if (isLoading || isError || !projects) {
    return null;
  }

  const categorizedProjects = useMemo(() => {
    return projects.reduce<CategorizedProjects>(
      (categorizedProjects, project) => {
        const projectType = getProjectType(project.properties);
        switch (projectType) {
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
  }, [projects, isLoading, isError]);

  return <ProjectMarkers categorizedProjects={categorizedProjects} />;
};

export default MultipleProjectsView;
