import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../src/features/common/Layout';
import tenantConfig from '../tenant.config';
import Head from 'next/head';
import UserProfileLoader from '../src/features/common/ContentLoaders/UserProfile/UserProfile';

const config = tenantConfig();

export default function Login() {
  const [session, loading] = useSession();
  const router = useRouter();

  React.useEffect(()=> {

  const fetchInfoFromBackend = async () => {
    try {
      const res = await fetch(
        `${process.env.API_ENDPOINT}/treemapper/accountInfo`,
        {
          headers: {
            Authorization: `OAuth ${session.accessToken}`,
          },
          method: 'GET',
        }
      );
      if (res.status === 200) {
        // user exists in db
        const resJson = await res.json();
        const newMeObj = {
          ...resJson,
          userSlug: 'trial-slug',
          isMe: true,
        };
        localStorage.setItem('userExistsInDB', JSON.stringify(true));
        localStorage.setItem('userprofile', JSON.stringify(newMeObj));
        if (typeof window !== 'undefined') {
          router.push(`/t/${newMeObj.userSlug}`);
        }
      } else if (res.status === 303) {
        localStorage.setItem('userExistsInDB', JSON.stringify(false));
        if (typeof window !== 'undefined') {
          router.push('/complete-signup');
        }
      } else {
        localStorage.setItem('userExistsInDB', JSON.stringify(false));
      }
    } catch (e){
      
    }
  }

  // no user present -> start login flow
    if (!loading && !session) {
      signIn('auth0', { callbackUrl: '/login' });
    }

  // some user present
  if (!loading && session){
    fetchInfoFromBackend()
  }
  }, [loading])

  return (
    <>
      <Head>
        <title>{`${config.meta.title} - Login`}</title>
      </Head>
      <Layout>
        <UserProfileLoader />
      </Layout>
    </>
  );
}
