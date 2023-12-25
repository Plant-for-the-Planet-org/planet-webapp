// Done

import React from 'react';
import CompleteSignup from '../src/features/user/CompleteSignup';
import tenantConfig from '../tenant.config';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPropsContext } from 'next';

export default function UserProfile() {
  const config = tenantConfig();
  return (
    <>
      <Head>
        <title>{`${config.meta.title} - Complete SignUp`}</title>
      </Head>
      <CompleteSignup />
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale || 'en',
        ['common', 'country', 'editProfile'],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}
