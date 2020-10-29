import React, { ReactElement } from 'react'
import ManageProjects from '../../../src/features/user/ManageProjects/screens'
import { useSession } from 'next-auth/client';
import { getUserExistsInDB, getUserSlug } from '../../../src/utils/auth0/localStorageUtils';
import { getAccountInfo } from '../../../src/utils/auth0/apiRequests';

interface Props {
    
}

export default function ManageProjectsPage({}: Props): ReactElement {
    const [session, loading] = useSession();
  // Check whether user is tpo or not

  const [accessDenied,setAccessDenied] = React.useState(false)

  const [setupAccess,setSetupAccess] = React.useState(false)

  React.useEffect(() => {
    async function loadUserData() {
      if (typeof Storage !== 'undefined') {
        const userExistsInDB = getUserExistsInDB();
        if (!loading && session && userExistsInDB) {
          try {
            const res = await getAccountInfo(session)
            if (res.status === 200) {
              const resJson = await res.json();
              if(resJson.type === 'tpo'){
                setAccessDenied(false)
                setSetupAccess(true)
              }
            }  else {
              setAccessDenied(true)
              setSetupAccess(true)
            }
          } catch (e) {}
        } 
      }
    }

    // loading is for session
    if (!loading) {
      loadUserData();
    }
  }, [loading]);


  // User is not logged in
  if (!loading && !session) {
    return (
      <h2>Please login to see this page</h2>
    )
  }

  // User is not TPO
  if(accessDenied && setupAccess){
    return (
      <h2>Access Denied</h2>
    )
  }
    return (
        <ManageProjects  session={session}/>
    )
}
