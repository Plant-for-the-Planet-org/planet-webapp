import Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import { useTranslation } from 'next-i18next';
import ApiKey from '../../src/features/user/Settings/ApiKey';

function EditProfilePage(): ReactElement {
  const { t } = useTranslation('me');
  return (
    <UserLayout>
      <Head>
        <title>{t('apiKey')}</title>
      </Head>
      <ApiKey />
    </UserLayout>
  );
}

export default EditProfilePage;
