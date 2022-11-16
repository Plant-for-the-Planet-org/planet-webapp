import Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import { useTranslation } from 'next-i18next';
import ImportData from '../../../src/features/user/TreeMapper/Import';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface Props {}

export default function Import({}: Props): ReactElement {
  const { t } = useTranslation('treemapper');
  return (
    <UserLayout>
      <Head>
        <title>{t('treemapper:importData')}</title>
      </Head>
      <ImportData />
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
