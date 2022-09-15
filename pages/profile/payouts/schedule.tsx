import React, { ReactElement } from 'react';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import ManagePayouts, {
  ManagePayoutSteps,
} from '../../../src/features/user/ManagePayouts';
import i18next from '../../../i18n';

const { useTranslation } = i18next;

export default function PayoutSchedulePage(): ReactElement {
  const { t, ready } = useTranslation('me');
  return (
    <UserLayout>
      <Head>
        <title>{ready ? t('managePayouts.titlePayoutSchedule') : ''}</title>
      </Head>
      <ManagePayouts step={ManagePayoutSteps.PAYOUT_SCHEDULE} />
    </UserLayout>
  );
}
