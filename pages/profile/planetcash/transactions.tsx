import React, { ReactElement, useState, useEffect } from 'react';
import TopProgressBar from '../../../src/features/common/ContentLoaders/TopProgressBar';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import PlanetCash, {
  PlanetCashTabs,
} from '../../../src/features/user/PlanetCash';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function PlanetCashTransactionsPage(): ReactElement {
  const { t, ready } = useTranslation('me');
  const [progress, setProgress] = useState(0);

  // Cleanup function to reset state and address Warning: Can't perform a React state update on an unmounted component.
  useEffect(() => {
    return () => {
      setProgress(0);
    };
  }, []);

  return (
    <>
      {progress > 0 && (
        <div className={'topLoader'}>
          <TopProgressBar progress={progress} />
        </div>
      )}
      <UserLayout>
        <Head>
          <title>{ready ? t('planetcash.titleTransactions') : ''}</title>
        </Head>
        <PlanetCash
          step={PlanetCashTabs.TRANSACTIONS}
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
