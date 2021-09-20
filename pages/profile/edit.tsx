import  Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import EditProfile from '../../src/features/user/Settings/EditProfile';
import i18next from '../../i18n';

const {useTranslation} = i18next;

function EditProfilePage(): ReactElement {
  const {t} = useTranslation('me');
  return (
    <UserLayout>
      <Head>
        <title>{t('editProfile')}</title>
      </Head>
      <EditProfile />
    </UserLayout>
  );
}

export default EditProfilePage;
