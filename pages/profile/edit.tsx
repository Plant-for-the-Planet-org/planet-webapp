import  Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import EditProfile from '../../src/features/user/Settings/EditProfile';

function EditProfilePage(): ReactElement {
  return (
    <UserLayout>
      <Head>
        <title>{'Edit Profile'}</title>
      </Head>
      <EditProfile />
    </UserLayout>
  );
}

export default EditProfilePage;
