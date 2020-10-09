import { useRouter } from 'next/router';
import React from 'react';
import ProjectsList from '../src/features/public/Donations/screens/Projects';
import GetAllProjectsMeta from '../src/utils/getMetaTags/GetAllProjectsMeta';
import getStoredCurrency from '../src/utils/countryCurrency/getStoredCurrency';
import {getRequest} from '../src/utils/apiRequests/api';
import storeConfig from '../src/utils/storeConfig';

interface Props {
  initialized: Boolean;
  projects: any;
  setProject: Function;
  setProjects: Function;
  setShowSingleProject: Function;
}

export default function Donate({
  initialized,
  projects,
  setProject,
  setProjects,
  setShowSingleProject,
}: Props) {
  const router = useRouter();

  React.useEffect(() => {
    storeConfig();
  }, []);
  
  // Load all projects
  React.useEffect(() => {
    async function loadProjects() {
      let currencyCode = getStoredCurrency();
      const projects = await getRequest(`/app/projects?_scope=map&currency=${currencyCode}`);
      setProjects(projects);
      setProject(null);
      setShowSingleProject(false);
    }
    loadProjects();
  }, []);

  const ProjectsProps = {
    projects,
  };

  return (
    <>
      {projects ? <GetAllProjectsMeta /> : null}
      {initialized ? (
        projects && initialized ? (
          <ProjectsList {...ProjectsProps} />
        ) : (
          <></>
        )
      ) : null}
    </>
  );
}
