import Head from 'next/head';
import React, { ReactElement, useContext, useEffect } from 'react';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import Analytics from '../../../src/features/user/TreeMapper/Analytics';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { UserPropsContext } from '../../../src/features/common/Layout/UserPropsContext';

function TreeMapperAnalytics(): ReactElement {
  const { t, ready } = useTranslation('treemapperAnalytics');

  const { user } = useContext(UserPropsContext);
  const { push } = useRouter();

  useEffect(() => {
    if (!(process.env.ENABLE_ANALYTICS && user?.type === 'tpo')) {
      push('/profile');
    }
  });

  return (
    <>
      <UserLayout>
        <Head>
          <title> {ready ? t('treemapperAnalytics:title') : ''} </title>
        </Head>
        <Analytics />
      </UserLayout>
    </>
  );
}

export default TreeMapperAnalytics;

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
          'treemapperAnalytics',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}
