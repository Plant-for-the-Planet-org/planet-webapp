import Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import i18next from '../../i18n';
import ApiKey from '../../src/features/user/Settings/ApiKey';

const { useTranslation } = i18next;

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
