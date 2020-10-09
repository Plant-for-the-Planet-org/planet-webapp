import { useRouter } from 'next/router';
import React from 'react';
import ProjectsList from '../src/features/public/Donations/screens/Projects';
import { getAllProjects } from '../src/utils/apiRequests/getAllProjects';
import GetAllProjectsMeta from '../src/utils/getMetaTags/GetAllProjectsMeta';

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

  // Load all projects
  React.useEffect(() => {
    setShowSingleProject(false);
    async function loadProjects() {
      const projects = await getAllProjects();
      if (projects === '404') {
        router.push('/404', undefined, { shallow: true });
      }
      setProjects(projects);
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
