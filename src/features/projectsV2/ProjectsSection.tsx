import ProjectSnippet from './components/ProjectSnippet';
import style from './styles/ProjectsSection.module.scss';
import { useProjects } from './ProjectsContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProjectsSection = () => {
  const { projects, isLoading, isError } = useProjects();
  if (isLoading || isError) {
    return <Skeleton className={style.projectSectionSkeleton} />;
  }

  return (
    <div className={style.projectList}>
      {projects?.map((project) => (
        <ProjectSnippet
          key={project.properties.id}
          project={project.properties}
          showPopup={true}
        />
      ))}
    </div>
  );
};

export default ProjectsSection;
