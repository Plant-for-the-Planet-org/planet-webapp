import  Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import Credits from '../../src/features/projects/components/maps/Credits';
import TreeMapper from '../../src/features/user/TreeMapper';

interface Props {
  setCurrencyCode:Function;
}

function TreeMapperPage({
  setCurrencyCode,
}: Props): ReactElement {
  return (
    <UserLayout>
      <Head>
        <title>{'TreeMapper'}</title>
      </Head>
      <TreeMapper />
      <Credits setCurrencyCode={setCurrencyCode} />
    </UserLayout>
  );
}

export default TreeMapperPage;
