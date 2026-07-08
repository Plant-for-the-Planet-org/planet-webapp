import ProjectMarkersGL from './ProjectMarkers/ProjectMarkersGL';
import { useProjects } from '../ProjectsContext';

interface MultipleProjectsViewProps {
  page: 'project-list' | 'project-details';
}

const MultipleProjectsView = ({ page }: MultipleProjectsViewProps) => {
  const { isError, filteredProjects } = useProjects();
  if (isError || !filteredProjects) return null;

  return <ProjectMarkersGL projects={filteredProjects} page={page} />;
};

export default MultipleProjectsView;
