import React, { useEffect, useState } from 'react';
import Layout from '../src/features/common/Layout';
import CompleteSignup from '../src/features/user/CompleteSignup'
import tenantConfig from '../tenant.config';
import Head from 'next/head';

const config = tenantConfig();

export default function UserProfile() {

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