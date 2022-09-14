import React, { ReactElement } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import DonationLink from '../../src/features/user/Widget/DonationLink';
import Head from 'next/head';
import i18next from '../../i18n';

const { useTranslation } = i18next;

interface Props {}
export default function DonationLinkPage({}: Props): ReactElement {
  const { t, ready } = useTranslation('me');
  return (
    <UserLayout>
      <Head>
        <title>{ready ? t('donationLinkTitle') : ''}</title>
      </Head>
      <DonationLink />
    </UserLayout>
  );
}
