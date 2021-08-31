import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import  Head from 'next/head';

interface Props {}

export default function Register({}: Props): ReactElement {
  const RegisterTrees = dynamic(
    () => import('../../src/features/user/RegisterTrees/RegisterTrees')
  );
  return (
    <UserLayout>
      <Head>
        <title>{'Register Trees'}</title>
      </Head>
      <RegisterTrees />
    </UserLayout>
  );
}
