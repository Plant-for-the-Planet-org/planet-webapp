import type { CategorizedProjects } from './ProjectMarkers';
import type { MapRef } from '../../common/types/projectv2';

import { useMemo } from 'react';
import ProjectMarkers from './ProjectMarkers';
import { useProjects } from '../ProjectsContext';
import { getProjectCategory } from '../../../utils/projectV2';

interface MultipleProjectsViewProps {
  mapRef: MapRef;
  page: 'project-list' | 'project-details';
}

const MultipleProjectsView = ({ page }: MultipleProjectsViewProps) => {
  const { projects, isLoading, isError, filteredProjects } = useProjects();
  if (isLoading || isError || !projects) return null;

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
  }, [projects, filteredProjects, isLoading, isError]);

  return (
    <ProjectMarkers categorizedProjects={categorizedProjects} page={page} />
  );
};

export default MultipleProjectsView;
