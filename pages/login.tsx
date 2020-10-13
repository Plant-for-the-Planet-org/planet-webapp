import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../src/features/common/Layout';
import tenantConfig from '../tenant.config';
import Head from 'next/head';

const config = tenantConfig();

export default function Login() {
  const [session, loading] = useSession();
  const router = useRouter();

  // start login flow
  if (!loading && !session) {
    signIn('auth0', { callbackUrl: '/complete-signup' });
  }

  //   new user
  if (!loading && session && !session.userExistsInDB) {
    if (typeof window !== 'undefined') {
      router.push('/complete-signup');
    }
  }

  //   existing user -> to user profile page
  if (!loading && session && session.userExistsInDB) {
    if (typeof window !== 'undefined') {
      router.push(`/t/${session.userprofile.userSlug}`);
    }
  }
  return (
    <>
      <Head>
        <title>{`${config.meta.title} - Login`}</title>
      </Head>
      <Layout>
        <React.Fragment />
      </Layout>
    </>
  );
}
