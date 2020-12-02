import { useRouter } from 'next/router';
import React from 'react';
import SingleProjectDetails from '../src/features/projects/screens/SingleProjectDetails';
import { getRequest } from '../src/utils/apiRequests/api';
import GetProjectMeta from '../src/utils/getMetaTags/GetProjectMeta';
import currencyContext from '../src/utils/Context/CurrencyContext';

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
  const { currency } = React.useContext(currencyContext);
  React.useEffect(() => {
    setShowSingleProject(true);
  }, []);

  React.useEffect(() => {
    async function loadProject() {
      const project = await getRequest(
        `/app/projects/${router.query.p}?_scope=extended&currency=${currency}`
      );
      setProject(project);
      setShowSingleProject(true);
    }
    if (router.query.p) {
      loadProject();
    }
  }, [router.query.p, currency]);

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
