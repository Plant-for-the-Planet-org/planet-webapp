import  Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import DeleteProfile from '../../src/features/user/Settings/DeleteProfile';
import { useTranslation } from 'react-i18next';

function DeleteProfilePage(): ReactElement {
  const {t} = useTranslation('me');
  return (
    <UserLayout>
      <Head>
        <title>{t('deleteProfile')}</title>
      </Head>
      <DeleteProfile />
    </UserLayout>
  );
}

export default DeleteProfilePage;
