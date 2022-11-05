import Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import TreeMapper from '../../../src/features/user/TreeMapper';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

interface Props {}

function TreeMapperPage({}: Props): ReactElement {
  // TODO - remove this
  // if (typeof window !== 'undefined') {
  //   router.push('/');
  // }
  const { t } = useTranslation('me');

  return (
    <UserLayout>
      <Head>
        <title>{t('treemapper')}</title>
      </Head>
      <TreeMapper />
    </UserLayout>
  );
}

export default TreeMapperPage;

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
