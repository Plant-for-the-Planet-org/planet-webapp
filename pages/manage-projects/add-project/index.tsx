import React, { ReactElement } from 'react'
import ManageProjects from '../../../src/features/user/ManageProjects/screens'
import AccessDeniedLoader from '../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../../src/features/common/Layout/Footer';
import GlobeContentLoader from '../../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import {  useAuth0 } from '@auth0/auth0-react';
import AccountHeader from  '../../../src/features/common/Layout/Header/accountHeader';
import i18next from '../../../i18n'
import { UserPropsContext } from '../../../src/features/common/Layout/UserPropsContext';
const { useTranslation } = i18next;

interface Props {

}

function ManageProjectsPage({ }: Props): ReactElement {

  const [accessDenied, setAccessDenied] = React.useState(false)
  const [setupAccess, setSetupAccess] = React.useState(false)
  const { t } = useTranslation(['me']);

  const {userprofile} = React.useContext(UserPropsContext);

  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect
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
      const usertype = userprofile.type;      
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
    else {
      localStorage.setItem('redirectLink','/manage-projects/add-project');
      loginWithRedirect({redirectUri:`${process.env.NEXTAUTH_URL}/login`, ui_locales: localStorage.getItem('language') || 'en' });
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
    <AccountHeader pageTitle={t('me:settingManageProject')}/>
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

export default ManageProjectsPage;