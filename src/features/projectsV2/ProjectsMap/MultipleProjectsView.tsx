import { useMemo } from 'react';
import { MapProject } from '../../common/types/projectv2';
import { useProjects } from '../ProjectsContext';
import ProjectMarkers from './ProjectMarkers';
import { getProjectType } from './utils';

type CategorizedProjects = {
  topApprovedProjects: MapProject[];
  nonDonatableProjects: MapProject[];
  regularDonatableProjects: MapProject[];
};

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

  const {
    topApprovedProjects,
    nonDonatableProjects,
    regularDonatableProjects,
  } = categorizedProjects;

  const renderMarkers = (projects: MapProject[]) => (
    <ProjectMarkers projects={projects} />
  );

  return (
    <>
      {renderMarkers(nonDonatableProjects)}
      {renderMarkers(regularDonatableProjects)}
      {renderMarkers(topApprovedProjects)}
    </>
  );
};

export default MultipleProjectsView;
