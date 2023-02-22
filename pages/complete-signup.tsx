import React from 'react';
import CompleteSignup from '../src/features/user/CompleteSignup';
import tenantConfig from '../tenant.config';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function UserProfile() {
  const config = tenantConfig();
  return (
    <>
      <Head>
        <title>{`${config.meta.title} - Complete SignUp`}</title>
      </Head>
      <CompleteSignup />
    </>
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
