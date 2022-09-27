import React, { ReactElement, useEffect, useState } from 'react';
import TopProgressBar from '../../../src/features/common/ContentLoaders/TopProgressBar';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import PlanetCash, {
  PlanetCashTabs,
} from '../../../src/features/user/PlanetCash';
import i18next from '../../../i18n';

const { useTranslation } = i18next;

export default function PlanetCashCreatePage(): ReactElement {
  const { t, ready } = useTranslation('me');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cleanup function to reset state and address Warning: Can't perform a React state update on an unmounted component.
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
          <title>{ready ? t('planetcash.titleCreateAccount') : ''}</title>
        </Head>
        <PlanetCash
          step={PlanetCashTabs.CREATE_ACCOUNT}
          setProgress={setProgress}
        />
      </UserLayout>
    </>
  );
}
