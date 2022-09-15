import React, { ReactElement, useState } from 'react';
import TopProgressBar from '../../../src/features/common/ContentLoaders/TopProgressBar';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import ManagePayouts, {
  ManagePayoutSteps,
} from '../../../src/features/user/ManagePayouts';
import i18next from '../../../i18n';

const { useTranslation } = i18next;

export default function OverviewPage(): ReactElement {
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
          <title>{ready ? t('managePayouts.titleOverview') : ''}</title>
        </Head>
        <ManagePayouts
          step={ManagePayoutSteps.OVERVIEW}
          setProgress={setProgress}
        />
      </UserLayout>
    </>
  );
}
