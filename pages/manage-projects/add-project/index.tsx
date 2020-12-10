import React, { ReactElement } from 'react'
import ManageProjects from '../../../src/features/user/ManageProjects/screens'
import { signIn, useSession } from 'next-auth/client';
import { getUserInfo } from '../../../src/utils/auth0/localStorageUtils';
import AccessDeniedLoader from '../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../../src/features/common/Layout/Footer';
import GlobeContentLoader from '../../../src/features/common/ContentLoaders/Projects/GlobeLoader';

interface Props {

}

export default function ManageProjectsPage({ }: Props): ReactElement {
  const [session, loading] = useSession();
  const [accessDenied, setAccessDenied] = React.useState(false)
  const [setupAccess, setSetupAccess] = React.useState(false)

  React.useEffect(() => {
    async function loadUserData() {
      const usertype = getUserInfo().type;
      console.log('usertype',usertype);
      
      if (usertype === 'tpo') {
        setAccessDenied(false)
        setSetupAccess(true)
      }else{
        setAccessDenied(true)
        setSetupAccess(true)
      }
    }

    // loading is for session
    if (!loading) {
      loadUserData();
    }
  }, [loading]);


  // User is not logged in
  if (!loading && !session) {
    signIn('auth0', { callbackUrl: `/login` });
  }

  // User is not TPO
  if (accessDenied && setupAccess) {
    return (
      <>
        <AccessDeniedLoader />
        <Footer />
      </>
    )
  }
  return setupAccess ? (
    <>
      <ManageProjects session={session} />
      <Footer />
    </>
  ) : (
    <>
    <GlobeContentLoader/>
    <Footer/>
    </>
  )
}
