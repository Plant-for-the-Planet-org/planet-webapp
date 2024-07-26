import ProjectSnippet from './components/ProjectSnippet';
import style from './styles/ProjectSection.module.scss';
import { useProjects } from './ProjectsContext';

const ProjectSection = () => {
  const { projects, isLoading, isError } = useProjects();
  if (isLoading || isError) {
    return null;
  }

  return (
    <div className={style.projectList}>
      {projects?.map((project) => (
        <ProjectSnippet
          key={project.properties.id}
          project={project.properties}
          shouldDisplayPopup={true}
        />
      ))}
    </div>
  );
};

export default ProjectSection;
