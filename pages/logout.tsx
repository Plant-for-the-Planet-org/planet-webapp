import { useSession, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import React from 'react';
import tenantConfig from '../tenant.config';

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
    if (typeof Storage !== 'undefined'){
      localStorage.removeItem('userExistsInDB')
      localStorage.removeItem('userprofile')
      signOut({ callbackUrl: '/' })
    }
  }
 
  return (
    <>
    </>
  );
}
