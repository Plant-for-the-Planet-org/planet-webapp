import React, { ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router';
import ManageProjects from '../../src/features/user/ManageProjects/screens'
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';
import GlobeContentLoader from '../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import AccessDeniedLoader from '../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../src/features/common/Layout/Footer';
import { useAuth0 } from '@auth0/auth0-react';

interface Props {

}

function ManageSingleProject({ }: Props): ReactElement {
  const [projectGUID, setProjectGUID] = React.useState(null);

  const [ready, setReady] = React.useState(false);

  const router = useRouter();

  const [accessDenied, setAccessDenied] = React.useState(false)
  const [setupAccess, setSetupAccess] = React.useState(false)

  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently
  } = useAuth0();

  useEffect(() => {
    if (router && router.query.id) {
      setProjectGUID(router.query.id);
      setReady(true);
    }
  }, [router]);


  const [project, setProject] = React.useState({})
  
  const [token, setToken] = React.useState('')
  // This effect is used to get and update UserInfo if the isAuthenticated changes
  React.useEffect(() => {
    async function loadFunction() {
      const token = await getAccessTokenSilently();
      setToken(token);
    }
    if (isAuthenticated) {
      loadFunction()
    }
  }, [isAuthenticated])

  useEffect(() => {
    async function loadProject() {      
      const token = await getAccessTokenSilently();
      getAuthenticatedRequest(`/app/profile/projects/${projectGUID}`, token).then((result) => {
        if (result.status === 401) {
          setAccessDenied(true)
          setSetupAccess(true)
        } else {
          setProject(result)
          setSetupAccess(true)
        }
      }).catch(() => {
        setAccessDenied(true)
        setSetupAccess(true)
      })
    }

    // ready is for router, loading is for session
    if (ready && !isLoading && isAuthenticated) {
      loadProject();
    }
  }, [ready, isLoading])

  if (accessDenied && setupAccess) {
    return (
      <>
        <AccessDeniedLoader />
        <Footer />
      </>
    )
  }

  // Showing error to other TPOs is left
  return setupAccess ? (ready && token && !accessDenied) ? (
    <>
      <ManageProjects GUID={projectGUID} token={token} project={project} />
      <Footer />
    </>
  ) : (<h2>NO Project ID FOUND</h2>) :
    (
      <>
        <GlobeContentLoader />
        <Footer />
      </>
    )
}

export default ManageSingleProject;
