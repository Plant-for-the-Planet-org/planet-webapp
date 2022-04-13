import React, { ReactElement } from 'react';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import BulkCodes from '../../../src/features/user/BulkCodes';
import Head from 'next/head';
import i18next from '../../../i18n';

const { useTranslation } = i18next;

interface Props {}
export default function BulkCodePage({}: Props): ReactElement {
  const { t } = useTranslation('me');
  return (
    <UserLayout>
      <Head>
        <title>{t('bulkCodes')}</title>
      </Head>
      <BulkCodes />
    </UserLayout>
  );
}
