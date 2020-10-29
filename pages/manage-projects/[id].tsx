import React, { ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router';
import ManageProjects from '../../src/features/user/ManageProjects/screens'
import { useSession } from 'next-auth/client';
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';
import GlobeContentLoader from '../../src/features/common/ContentLoaders/Projects/GlobeLoader';

interface Props {

}

function ManageSingleProject({ }: Props): ReactElement {
  const [projectGUID, setProjectGUID] = React.useState(null);

  const [ready, setReady] = React.useState(false);
  const [session, loading] = useSession();

  const router = useRouter();

  const [accessDenied, setAccessDenied] = React.useState(false)
  const [setupAccess, setSetupAccess] = React.useState(false)

  useEffect(() => {
    if (router && router.query.id !== undefined) {
      setProjectGUID(router.query.id);
      setReady(true);
    }
  }, [router]);


  const [project, setProject] = React.useState({})

  useEffect(() => {
    async function loadProject() {
      getAuthenticatedRequest(`/app/profile/projects/${projectGUID}?_scope=default`, session).then((result) => {
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
    if (ready && !loading) {
      loadProject();
    }
  }, [ready, session, loading])

  if (!loading && !session) {
    return (
      <h2>Please login to see this page</h2>
    )
  }

  if (accessDenied && setupAccess) {
    return (
      <h2>Access Denied</h2>
    )
  }

  // Showing error to other TPOs is left
  return setupAccess ? (ready && session && !accessDenied) ? (
    <ManageProjects GUID={projectGUID} session={session} project={project} />
  ) : (<h2>NO Project ID FOUND</h2>) :
    (
      <GlobeContentLoader/>
    )
}

export default ManageSingleProject
