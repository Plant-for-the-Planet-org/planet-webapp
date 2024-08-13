import ProjectSnippet from '../components/ProjectSnippet';
import { useProjects } from '../ProjectsContext';
import ProjectInfoSection from './ProjectInfoSection';

const ProjectDetails = () => {
  const { singleProject } = useProjects();
  return singleProject ? (
    <>
      <ProjectSnippet project={singleProject} showPopup={false} />
      <ProjectInfoSection />
    </>
  ) : null;
};

export default ProjectDetails;
