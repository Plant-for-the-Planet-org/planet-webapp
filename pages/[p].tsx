import { useRouter } from 'next/router';
import React from 'react';
import SingleProjectDetails from '../src/features/public/Donations/components/SingleProjectDetails';
import { getRequest } from '../src/utils/apiRequests/api';
import getStoredCurrency from '../src/utils/countryCurrency/getStoredCurrency';
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

  React.useEffect(() => {
    setShowSingleProject(true);
  }, []);

  React.useEffect(() => {
    async function loadProject() {
      let currencyCode = getStoredCurrency();
      const project = await getRequest(`/app/projects/${router.query.p}?_scope=extended&currency=${currencyCode}`);
      setProject(project);
      setShowSingleProject(true);
    }
    if(router.query.p !== undefined) {
      loadProject();
    }
  }, [router.query.p]);

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
