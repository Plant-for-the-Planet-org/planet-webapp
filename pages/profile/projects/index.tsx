import React, { ReactElement } from 'react';
import ProjectsContainer from '../../../src/features/user/ManageProjects/ProjectsContainer';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useUserProps } from '../../../src/features/common/Layout/UserPropsContext';
import AccessDeniedLoader from '../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
interface Props {}
export default function Register({}: Props): ReactElement {
  const { t } = useTranslation('me');
  const { user } = useUserProps();

  return (
    <UserLayout>
      <Head>
        <title>{t('projects')}</title>
      </Head>
      {user?.type === 'tpo' ? <ProjectsContainer /> : <AccessDeniedLoader />}
    </UserLayout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
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
