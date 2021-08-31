import  Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import TreeMapper from '../../src/features/user/TreeMapper';

interface Props {}

function TreeMapperPage({}: Props): ReactElement {
  return (
    <UserLayout>
      <Head>
        <title>{'TreeMapper'}</title>
      </Head>
      <TreeMapper />
    </UserLayout>
  );
}

export default TreeMapperPage;
