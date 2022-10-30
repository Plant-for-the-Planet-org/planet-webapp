import React, { ReactElement, useState } from 'react';
import TopProgressBar from '../../../src/features/common/ContentLoaders/TopProgressBar';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import ManagePayouts, {
  ManagePayoutTabs,
} from '../../../src/features/user/ManagePayouts';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function OverviewPage(): ReactElement {
  const { t, ready, i18n } = useTranslation('me');
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (localStorage.getItem('i18nextLng') !== null && i18n) {
      const languageFromLocalStorage: any = localStorage.getItem('i18nextLng');
      i18n.changeLanguage(languageFromLocalStorage);
    }
  }, [i18n]);

  return (
    <>
      {progress > 0 && (
        <div className={'topLoader'}>
          <TopProgressBar progress={progress} />
        </div>
      )}
      <UserLayout>
        <Head>
          <title>{ready ? t('managePayouts.titleOverview') : ''}</title>
        </Head>
        <ManagePayouts
          step={ManagePayoutTabs.OVERVIEW}
          setProgress={setProgress}
        />
      </UserLayout>
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
