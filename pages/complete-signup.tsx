import { signIn, signOut, useSession, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Layout from '../src/features/common/Layout';

export default function UserProfile() {
  const router = useRouter();
  const [session, loading] = useSession();

  if (!session) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
  }
  if (loading) {
    return null;
  } else {
  }
  return (
    <Layout>
      <h2 style={{ marginTop: '80px' }}>Complete profile page</h2>
    </Layout>
  );
}
