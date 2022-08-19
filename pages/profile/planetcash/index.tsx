import React, { ReactElement } from 'react';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import i18next from '../../../i18n';

const { useTranslation } = i18next;

export default function PlanetCashPage(): ReactElement {
  const { t, ready } = useTranslation('me');
  return (
    <UserLayout>
      <Head>
        <title>{ready ? t('planetcash.title') : ''}</title>
      </Head>
      {/* <BulkCodes step={BulkCodeSteps.SELECT_METHOD} /> */}
    </UserLayout>
  );
}
