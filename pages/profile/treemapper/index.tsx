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
  const { t, i18n } = useTranslation('me');

  React.useEffect(() => {
    if (localStorage.getItem('i18nextLng') !== null && i18n) {
      const languageFromLocalStorage: any = localStorage.getItem('i18nextLng');
      i18n.changeLanguage(languageFromLocalStorage);
    }
  }, [i18n]);

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
          'donation',
          'editProfile',
          'leaderboard',
          'managePay',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTree',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}
