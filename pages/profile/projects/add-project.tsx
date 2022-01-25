import React, { ReactElement } from 'react';
import ManageProjects from '../../../src/features/user/ManageProjects';
import AccessDeniedLoader from '../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../../src/features/common/Layout/Footer';
import GlobeContentLoader from '../../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import { UserPropsContext } from '../../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import i18next from './../../../i18n';
import  Head from 'next/head';

const { useTranslation } = i18next;

interface Props {}

function ManageProjectsPage({}: Props): ReactElement {
  const [accessDenied, setAccessDenied] = React.useState(false);
  const [setupAccess, setSetupAccess] = React.useState(false);

  const { user, contextLoaded, token, loginWithRedirect } = React.useContext(
    UserPropsContext
  );
  const { t, i18n } = useTranslation(['manageProjects']);


  React.useEffect(() => {
    async function loadUserData() {
      const usertype = user.type;
      if (usertype === 'tpo') {
        setAccessDenied(false);
        setSetupAccess(true);
      } else {
        setAccessDenied(true);
        setSetupAccess(true);
      }
    }

    if (contextLoaded) {
      if (token && user) {
        loadUserData();
      } else {
        localStorage.setItem('redirectLink', '/profile/projects/add-project');
        loginWithRedirect({
          redirectUri: `${process.env.NEXTAUTH_URL}/login`,
          ui_locales: localStorage.getItem('language') || 'en',
        });
      }
    }
  }, [contextLoaded]);

  // User is not TPO
  if (accessDenied && setupAccess) {
    return (
      <>
        <AccessDeniedLoader />
        <Footer />
      </>
    );
  }
  return setupAccess ? (
    <UserLayout>
      <Head>
        <title>{t('addProject')}</title>
      </Head>
      <div className="profilePage">
        <div className="profilePageHeader">
          <div>
            <div className={'profilePageTitle'}>
              {' '}
              {t('manageProjects:addProject')}
            </div>
          </div>
        </div>
        <ManageProjects token={token} />
      </div>
    </UserLayout>
  ) : (
    <GlobeContentLoader />
  );
}

export default ManageProjectsPage;
