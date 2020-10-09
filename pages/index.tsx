import { useRouter } from 'next/router';
import React from 'react';
import ProjectsList from '../src/features/public/Donations/screens/Projects';
import { getAllProjects } from '../src/utils/apiRequests/getAllProjects';
import { getSingleProject } from '../src/utils/apiRequests/getSingleProject';
import GetProjectMeta from '../src/utils/getMetaTags/GetProjectMeta';
import GetAllProjectsMeta from '../src/utils/getMetaTags/GetAllProjectsMeta';

interface Props {
  initialized: Boolean;
}

export default function Donate(initialized: Props) {
  const router = useRouter();
  const [projects, setProjects] = React.useState();
  const [project, setProject] = React.useState(null);
  const [showSingleProject, setShowSingleProject] = React.useState(false);

  // Code to find out whether show single project or list of project
  React.useEffect(() => {
    if (router.asPath === '/') {
      setShowSingleProject(false);
      setProject(null);
      // Dont show single project 
    } else {
      if (router.query.p !== undefined && router.query.p !== 'undefined') {
        fetchSingleProject(router.query.p).then(() => {
          setShowSingleProject(true);
          // Show single project 
        });
      } else {
        setShowSingleProject(false);
        setProject(null);
        // Dont show single project 
      }
    }
  }, [router.query.p]);

  // Load all projects
  React.useEffect(() => {
    async function loadProjects() {
      const projects = await getAllProjects();
      if(projects === '404'){
        router.push('/404', undefined, { shallow: true });
      }
      setProjects(projects)
    }
    loadProjects();
  }, []);

  // Load single project
  async function fetchSingleProject(id: any) {
    const project = await getSingleProject(id);
      if(project === '404'){
        router.push('/404', undefined, { shallow: true });
      }
      setProject(project)
  }

  const DonateProps = {
    projects,
    project,
    fetchSingleProject,
    showSingleProject,
  };

  return (
    <>
      {project ? (
          <GetProjectMeta project={project} />
      ) : (
        <GetAllProjectsMeta/>
      )}
      {initialized ? (
          projects && initialized ? <ProjectsList {...DonateProps} /> : <></>
      ) : null}
    </>
  );
}
