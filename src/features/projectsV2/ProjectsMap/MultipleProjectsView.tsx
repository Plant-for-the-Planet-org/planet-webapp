import { useMemo } from 'react';
import { useProjects } from '../ProjectsContext';
import ProjectMarkers, { CategorizedProjects } from './ProjectMarkers';
import { getProjectCategory } from './utils';
import { MapProject } from '../../common/types/projectv2';

const MultipleProjectsView = ({
  projectsToDisplay,
}: {
  projectsToDisplay: MapProject[] | null | undefined;
}) => {
  const {
    projects,
    filteredProjects,
    isLoading,
    isError,
    selectedClassification,
    searchProjectResults,
  } = useProjects();

  if (isLoading || isError || !projects) {
    return null;
  }

  const categorizedProjects = useMemo(() => {
    return projectsToDisplay?.reduce<CategorizedProjects>(
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
  }, [projects, filteredProjects, searchProjectResults, isLoading, isError]);
  return (
    <ProjectMarkers
      categorizedProjects={categorizedProjects}
      selectedClassification={selectedClassification}
    />
  );
};

export default MultipleProjectsView;
