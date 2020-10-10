import { useSession, signIn, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../src/features/common/Layout';
import tenantConfig from '../tenant.config';
import Head from 'next/head';

const config = tenantConfig();

export default function Logout() {
  const [session, loading] = useSession();
  const router = useRouter();

  // no session
  if (!loading && !session) {
    if (typeof window !== 'undefined') {
        router.push('/');
      }
  }

  // session present
  if (!loading && session) {
    signOut({ callbackUrl: '/' })
  }
 
  return (
    <>
    </>
  );
}
