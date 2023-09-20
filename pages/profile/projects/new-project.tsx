import { useTranslation } from 'next-i18next';
import React, { ReactElement } from 'react';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import ManageProjects from '../../../src/features/user/ManageProjects';
import { useUserProps } from '../../../src/features/common/Layout/UserPropsContext';
import AccessDeniedLoader from '../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../../src/features/common/Layout/Footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { GetStaticPropsContext } from 'next';

export default function AddProjectType(): ReactElement {
  const { t } = useTranslation(['donate', 'manageProjects']);
  const [accessDenied, setAccessDenied] = React.useState<boolean>(false);
  const [setupAccess, setSetupAccess] = React.useState<boolean>(false);
  const { user, contextLoaded, token, loginWithRedirect } = useUserProps();

  React.useEffect(() => {
    async function loadUserData() {
      const usertype = user?.type;
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
        localStorage.setItem(
          'redirectLink',
          '/profile/projects/add-project/restoration-project'
        );
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

  return (
    <UserLayout>
      <Head>
        <title>{t('manageProjects:addNewProject')}</title>
      </Head>

      {user?.type === 'tpo' && token !== null ? (
        <ManageProjects token={token} />
      ) : (
        <AccessDeniedLoader />
      )}
    </UserLayout>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale || 'en',
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}
