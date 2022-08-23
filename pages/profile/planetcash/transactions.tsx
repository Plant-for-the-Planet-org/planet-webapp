import React, { ReactElement, useState } from 'react';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import PlanetCash, {
  PlanetCashTabs,
} from '../../../src/features/user/PlanetCash';
import TopProgressBar from '../../../src/features/common/ContentLoaders/TopProgressBar';
import i18next from '../../../i18n';

const { useTranslation } = i18next;

export default function PlanetCashTransactionsPage(): ReactElement {
  const { t, ready } = useTranslation('me');
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
