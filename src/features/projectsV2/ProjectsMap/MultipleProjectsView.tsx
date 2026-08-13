import { useFilteredProjects } from '../../../hooks/useFilteredProjects';
import { useProjectStore } from '../../../stores';
import ProjectMarkersGL from './ProjectMarkers/ProjectMarkersGL';

const MultipleProjectsView = () => {
  const isProjectsError = useProjectStore((state) => state.isProjectsError);
  const { filteredProjects } = useFilteredProjects();

  if (isProjectsError) return null;

  return <ProjectMarkersGL projects={filteredProjects} />;
};

export default MultipleProjectsView;
