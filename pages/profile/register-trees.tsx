import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

interface Props {}

export default function Register({}: Props): ReactElement {
  const { t } = useTranslation('me');

  const RegisterTrees = dynamic(
    () => import('../../src/features/user/RegisterTrees/RegisterTrees')
  );
  return (
    <UserLayout>
      <Head>
        <title>{t('registerTrees')}</title>
      </Head>
      <RegisterTrees />
    </UserLayout>
  );
}

export async function getStaticProps({ locale }: any) {
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
