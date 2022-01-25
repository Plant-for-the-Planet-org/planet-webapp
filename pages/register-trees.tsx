import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

interface Props {}

export default function Register({}: Props): ReactElement {
  const RegisterTrees = dynamic(
    () => import('../src/tenants/treesforjane/RegisterTrees/JaneRegisterTrees')
  );
  return (
    <>
      <Head>
        <title>{'Register Trees'}</title>
      </Head>
      <RegisterTrees />
    </>
  );
}
