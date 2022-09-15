import React, { ReactElement } from 'react';
import UserLayout from '../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import ManagePayouts, {
  ManagePayoutSteps,
} from '../../../../src/features/user/ManagePayouts';
import i18next from '../../../../i18n';

const { useTranslation } = i18next;

export default function EditBankDetailsPage(): ReactElement {
  const { t, ready } = useTranslation('me');

  return (
    <UserLayout>
      <Head>
        <title>{ready ? t('managePayouts.titleEditBankDetails') : ''}</title>
      </Head>
      <ManagePayouts step={ManagePayoutSteps.OVERVIEW} isEdit={true} />
    </UserLayout>
  );
}
