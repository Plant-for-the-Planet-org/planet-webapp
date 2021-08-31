import  Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import DeleteProfile from '../../src/features/user/Settings/DeleteProfile';

function DeleteProfilePage(): ReactElement {
  return (
    <UserLayout>
      <Head>
        <title>{'Delete Profile'}</title>
      </Head>
      <DeleteProfile />
    </UserLayout>
  );
}

export default DeleteProfilePage;
