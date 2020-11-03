import { useSession, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import React from 'react';
import tenantConfig from '../tenant.config';
import {
  removeUserExistsInDB,
  removeUserInfo
} from '../src/utils/auth0/localStorageUtils';

const config = tenantConfig();

export default function Logout() {
  const [session, loading] = useSession();
  const router = useRouter();

  React.useEffect(() => {
    const logoutAllSessions = async () => {
      try {
        // clear application session
        removeUserExistsInDB();
        removeUserInfo();
        signOut();
        console.log('application session cleared.....');

        // clear auth0 session
        const logoutEndpoint = `https://${process.env.AUTH0_CUSTOM_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=https://${process.env.NEXTAUTH_URL}`;
        console.log('auth0 logout endpoint:', logoutEndpoint);
        if (typeof window !== 'undefined') {
          router.push(logoutEndpoint);
        }
        console.log('auth0 session cleared.....');
      } catch (e) {
        console.log('error logout', e);
      }
    };

    // no session
    if (!loading && !session) {
      if (typeof window !== 'undefined') {
        router.push('/');
      }
    }

    // session present
    if (!loading && session) {
      if (typeof Storage !== 'undefined') {
        logoutAllSessions();
      }
    }
  }, [loading]);

  return <></>;
}
