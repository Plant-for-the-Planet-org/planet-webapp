import { useEffect, useMemo } from 'react';
import { useProjects } from '../ProjectsContext';
import ProjectMarkers, { CategorizedProjects } from './ProjectMarkers';
import { getProjectCategory } from '../../../utils/projectV2';
import { zoomOutMap } from '../../../utils/mapsV2/zoomToProjectSite';
import { SetState } from '../../common/types/common';
import { ViewState } from 'react-map-gl-v7';
import { MapRef } from '../../../utils/mapsV2/zoomToProjectSite';
interface MultipleProjectsViewProps {
  setViewState: SetState<ViewState>;
  mapRef: MapRef;
}

const MultipleProjectsView = ({
  setViewState,
  mapRef,
}: MultipleProjectsViewProps) => {
  const {
    projects,
    isLoading,
    isError,
    selectedClassification,
    filteredProjects,
    singleProject,
  } = useProjects();
  if (isLoading || isError || !projects) {
    return null;
  }
  useEffect(() => {
    if (singleProject === null && mapRef.current) {
      const map = mapRef.current.getMap
        ? mapRef.current.getMap()
        : mapRef.current;
      zoomOutMap(map, () => {
        setViewState((prevState) => ({
          ...prevState,
          ...map.getCenter(),
          zoom: map.getZoom(),
        }));
      });
    }
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
    <ProjectMarkers
      categorizedProjects={categorizedProjects}
      selectedClassification={selectedClassification}
    />
  );
};

export default MultipleProjectsView;
