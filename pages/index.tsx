import { useRouter } from 'next/router';
import React from 'react';
import ProjectsList from '../src/features/public/Donations/screens/Projects';
import GetProjectMeta from '../src/utils/getMetaTags/GetProjectMeta';
import GetAllProjectsMeta from '../src/utils/getMetaTags/GetAllProjectsMeta';
import getStoredCurrency from '../src/utils/countryCurrency/getStoredCurrency';
import {getRequest} from '../src/utils/apiRequests/api';
import storeConfig from '../src/utils/storeConfig';

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

  React.useEffect(() => {
    storeConfig();
  }, []);
  
  // Load all projects
  React.useEffect(() => {
    async function loadProjects() {
      let currencyCode = getStoredCurrency();
      const projects = await getRequest(`/app/projects?_scope=map&currency=${currencyCode}`);
      setProjects(projects)
    }
    loadProjects();
  }, []);

  // Load single project
  async function fetchSingleProject(id: any) {
    let currencyCode = getStoredCurrency();
    const project = await getRequest(`/app/projects/${id}?_scope=extended&currency=${currencyCode}`);
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
