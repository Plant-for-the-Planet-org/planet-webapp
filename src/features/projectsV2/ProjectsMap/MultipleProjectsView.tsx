import type { CategorizedProjects } from './ProjectMarkers';
import type { MapRef } from '../../common/types/projectv2';

import { useEffect, useMemo } from 'react';
import ProjectMarkers from './ProjectMarkers';
import { useProjects } from '../ProjectsContext';
import { useProjectsMap } from '../ProjectsMapContext'; // Add this import
import { getProjectCategory } from '../../../utils/projectV2';
import { zoomOutMap } from '../../../utils/mapsV2/zoomToProjectSite';

interface MultipleProjectsViewProps {
  mapRef: MapRef;
  page: 'project-list' | 'project-details';
}

const MultipleProjectsView = ({ mapRef, page }: MultipleProjectsViewProps) => {
  const { projects, isLoading, isError, filteredProjects } = useProjects();
  const { handleViewStateChange } = useProjectsMap();
  if (isLoading || isError || !projects) {
    return null;
  }

  useEffect(() => {
    //Wrapping the logic in Promise.resolve().then() defers the map-related code until after synchronous tasks finish,
    //Giving the map time to initialize fully. This ensures mapRef.current is ready for interaction.
    Promise.resolve().then(() => {
      if (mapRef.current) {
        const map = mapRef.current.getMap
          ? mapRef.current.getMap()
          : mapRef.current;
        zoomOutMap(map, () => {
          handleViewStateChange({
            ...map.getCenter(),
            zoom: map.getZoom(),
          });
        });
      }
    });
  }, []);

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
