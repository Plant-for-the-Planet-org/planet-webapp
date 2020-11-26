import React, { ReactElement } from 'react'
import ManageProjects from '../../../src/features/user/ManageProjects/screens'
import { getUserInfo } from '../../../src/utils/auth0/localStorageUtils';
import AccessDeniedLoader from '../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../../src/features/common/Layout/Footer';
import GlobeContentLoader from '../../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import { withAuthenticationRequired, useAuth0 } from '@auth0/auth0-react';

interface Props {

}

function ManageProjectsPage({ }: Props): ReactElement {

  const [accessDenied, setAccessDenied] = React.useState(false)
  const [setupAccess, setSetupAccess] = React.useState(false)

  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently
  } = useAuth0();

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

  React.useEffect(() => {
    async function loadUserData() {
      const usertype = getUserInfo().type;      
      if (usertype === 'tpo') {
        setAccessDenied(false)
        setSetupAccess(true)
      }else{
        setAccessDenied(true)
        setSetupAccess(true)
      }
    }

    if (!isLoading && isAuthenticated) {
      loadUserData();
    }
  }, [isLoading, isAuthenticated]);

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
      <ManageProjects token={token} />
      <Footer />
    </>
  ) : (
    <>
    <GlobeContentLoader/>
    <Footer/>
    </>
  )
}

export default withAuthenticationRequired(ManageProjectsPage, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>Only Reforestation Organizations can access this page</div>,
});