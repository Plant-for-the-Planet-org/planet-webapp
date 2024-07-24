import ProjectSnippet from '../projects/components/ProjectSnippet';
import style from '../common/Layout/ProjectsLayout/ProjectsLayout.module.scss';
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
          editMode={false}
          displayPopup={true}
        />
      ))}
    </div>
  );
};

export default ProjectSection;
