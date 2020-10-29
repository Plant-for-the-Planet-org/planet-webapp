import React, { ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router';
import ManageProjects from '../../src/features/user/ManageProjects/screens'
import {  useSession } from 'next-auth/client';
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';

interface Props {

}

function ManageSingleProject({ }: Props): ReactElement {
  const [projectGUID, setProjectGUID] = React.useState(null);
  const [ready, setReady] = React.useState(false);
  const [session, loading] = useSession();

  const router = useRouter();

  // Check whether user is logged in or not
  // Check whether user is tpo or not
  // Check whether project belongs to tpo or not

  const [accessDenied,setAccessDenied] = React.useState(false)

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
        if(result.status === 401){
          setAccessDenied(true)
        } else if (result.status === 200){
          setProject(result)
        }
      }).catch( ()=> {
        setAccessDenied(true)
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

  if(accessDenied){
    return (
      <h2>Access Denied</h2>
    )
  }
  return ready && session && !accessDenied ? (
    <ManageProjects GUID={projectGUID} session={session} project={project} />
  ) : (<h2>NO Project ID FOUND</h2>)
}

export default ManageSingleProject
