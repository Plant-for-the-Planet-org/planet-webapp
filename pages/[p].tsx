import { useRouter } from 'next/router';
import React from 'react';
import SingleProjectDetails from '../src/features/public/Donations/components/SingleProjectDetails';
import { getSingleProject } from '../src/utils/apiRequests/getSingleProject';
import GetProjectMeta from '../src/utils/getMetaTags/GetProjectMeta';

interface Props {
  initialized: Boolean;
  project: any;
  setProject: Function;
  setShowSingleProject: Function;
}

export default function Donate({
  initialized,
  project,
  setProject,
  setShowSingleProject,
}: Props) {
  const router = useRouter();

  // Code to find out whether show single project or list of project
  React.useEffect(() => {
    fetchSingleProject(router.query.p)
      .then(() => {
        setShowSingleProject(true);
        // Show single project
      })
      .catch((err) => {
        setShowSingleProject(false);
        setProject(null);
        console.log('An error occured:', err);
        router.push('/404', undefined, { shallow: true });
      });
  }, [router.query.p]);

  // Load single project
  async function fetchSingleProject(id: any) {
    const project = await getSingleProject(id);
    if (project === '404') {
      router.push('/404', undefined, { shallow: true });
    }
    setProject(project);
  }

  const ProjectProps = {
    project,
  };

  return (
    <>
      {project ? <GetProjectMeta {...ProjectProps} /> : null}
      {initialized ? (
        project && initialized ? (
          <SingleProjectDetails {...ProjectProps} />
        ) : (
          <></>
        )
      ) : null}
    </>
  );
}
