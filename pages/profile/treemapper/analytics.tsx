import Head from 'next/head';
import React, { ReactElement, useState } from 'react';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import Analytics from '../../../src/features/user/TreeMapper/Analytics';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import TopProgressBar from '../../../src/features/common/ContentLoaders/TopProgressBar';

interface Props {}

function TreeMapperAnalytics({}: Props): ReactElement {
  const { t, ready } = useTranslation('treemapperAnalytics');
  const [progress, setProgress] = useState(0);
  return (
    <>
      {progress > 0 && (
        <div className={'topLoader'}>
          <TopProgressBar progress={progress} />
        </div>
      )}
      <UserLayout>
        <Head>
          <title> {ready ? t('treemapperAnalytics:title') : ''} </title>
        </Head>
        <Analytics setProgress={setProgress} />
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
