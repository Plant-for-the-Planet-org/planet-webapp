import React, { ReactElement } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import DonationLink from '../../src/features/user/Widget/DonationLink';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface Props {}
export default function DonationLinkPage({}: Props): ReactElement {
  const { t, ready } = useTranslation(['me']);
  return (
    <UserLayout>
      <Head>
        <title>{ready ? t('donationLinkTitle') : ''}</title>
      </Head>
      <DonationLink />
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
