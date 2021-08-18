import React, { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import ManageProjects from '../../src/features/user/ManageProjects';
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';
import GlobeContentLoader from '../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import AccessDeniedLoader from '../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../src/features/common/Layout/Footer';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';

interface Props {}

function ManageSingleProject({}: Props): ReactElement {
  const [projectGUID, setProjectGUID] = React.useState(null);
  const [ready, setReady] = React.useState(false);
  const router = useRouter();
  const [accessDenied, setAccessDenied] = React.useState(false);
  const [setupAccess, setSetupAccess] = React.useState(false);
  const [project, setProject] = React.useState({});

  const { user, contextLoaded, token } = React.useContext(UserPropsContext);

  useEffect(() => {
    if (router && router.query.id) {
      setProjectGUID(router.query.id);
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    async function loadProject() {
      getAuthenticatedRequest(`/app/profile/projects/${projectGUID}`, token)
        .then((result) => {
          if (result.status === 401) {
            setAccessDenied(true);
            setSetupAccess(true);
          } else {
            setProject(result);
            setSetupAccess(true);
          }
        })
        .catch(() => {
          setAccessDenied(true);
          setSetupAccess(true);
        });
    }

    // ready is for router, loading is for session
    if (ready && contextLoaded && user) {
      loadProject();
    }
  }, [ready, contextLoaded, user]);

  if (accessDenied && setupAccess) {
    return (
      <>
        <AccessDeniedLoader />
        <Footer />
      </>
    );
  }

  // Showing error to other TPOs is left
  return setupAccess ? (
    ready && token && !accessDenied ? (
      <>
        <ManageProjects GUID={projectGUID} token={token} project={project} />
        <Footer />
      </>
    ) : (
      <>
        <GlobeContentLoader />
        <Footer />
      </>
    )
  ) : (
    <>
      <GlobeContentLoader />
      <Footer />
    </>
  );
}

export default ManageSingleProject;
