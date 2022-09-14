import React, { ReactElement, useState } from 'react';
import TopProgressBar from '../../../src/features/common/ContentLoaders/TopProgressBar';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import PlanetCash, {
  PlanetCashTabs,
} from '../../../src/features/user/PlanetCash';
import { useTranslation } from 'next-i18next';



export default function PlanetCashPage(): ReactElement {
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
          <title>{ready ? t('planetcash.titleAccount') : ''}</title>
        </Head>
        <PlanetCash
          step={PlanetCashTabs.ACCOUNTS}
          setProgress={setProgress}
          shouldReload={true}
        />
      </UserLayout>
    </>
  );
}
