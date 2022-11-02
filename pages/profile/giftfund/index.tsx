import React, { ReactElement } from 'react';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import i18next from '../../../i18n';
import GiftFunds from '../../../src/features/user/GiftFunds';

const { useTranslation } = i18next;

interface Props {}
export default function Register({}: Props): ReactElement {
  const { t } = useTranslation('me');
  return (
    <UserLayout>
      <Head>
        <title>{t('giftFund')}</title>
      </Head>
      <GiftFunds />
    </UserLayout>
  );
}
