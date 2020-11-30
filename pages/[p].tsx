import { useRouter } from 'next/router';
import React from 'react';
import NetworkFailure from '../src/features/common/ErrorComponents/NetworkFailure';
import SingleProjectDetails from '../src/features/projects/screens/SingleProjectDetails';
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
  const [network, setNetwork] = React.useState(false);

  React.useEffect(() => {
    setShowSingleProject(true);
  }, []);

  React.useEffect(() => {
    async function loadProject() {
      let currencyCode = getStoredCurrency();
      await getRequest(
        `/app/projects/${router.query.p}?_scope=extended&currency=${currencyCode}`
      )
        .then((data) => {
          setProject(data);
          setShowSingleProject(true);
          setNetwork(false);
        })
        .catch((err) => {
          setNetwork(true);
        });
    }
    if (router.query.p) {
      loadProject();
    }
  }, [router.query.p]);

  const handleNetwork = () => {
    setNetwork(!network);
  };

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
      {network && (
        <div style={{ position: 'fixed', bottom: 0, left: 0 }}>
          <NetworkFailure refresh handleNetwork={handleNetwork} />
        </div>
      )}
    </>
  );
}
