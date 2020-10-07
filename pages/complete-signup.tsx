import {  useSession} from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../src/features/common/Layout';
import CompleteSignup from '../src/features/user/CompleteSignup'
import tenantConfig from '../tenant.config';
import Head from 'next/head';

const config = tenantConfig();

export default function UserProfile() {
  const [session, loading] = useSession();
  const router = useRouter();
  if (!loading && !session) {
      if (typeof window !== 'undefined') {
        router.push('/');
      }
  }
  return(
    <>
    <Head>
        <title>{`${config.meta.title} - Complete SignUp`}</title>
    </Head>
    <Layout>
       <CompleteSignup
          style={{ height: '100vh', overflowX: 'hidden' }}
        />
    </Layout>
    </>
  );
}