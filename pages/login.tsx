import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../src/features/common/Layout';
import tenantConfig from '../tenant.config';
import Head from 'next/head';
import UserProfileLoader from '../src/features/common/ContentLoaders/UserProfile/UserProfile';
import {setUserSlug, setUserExistsInDB} from '../src/utils/auth0/localStorageUtils'
const config = tenantConfig();

export default function Login() {
  const [session, loading] = useSession();
  const router = useRouter();

  React.useEffect(()=> {

  const fetchInfoFromBackend = async () => {
    try {
      console.log('------API CALL TO THE BACKEND------')
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
        console.log('in 200-> user exists in our DB')
        // user exists in db
        const resJson = await res.json();
        const newMeObj = {
          ...resJson,
          userSlug: 'trial-slug',
          isMe: true,
        };
        setUserExistsInDB(true)
        setUserSlug(newMeObj.userSlug)
        if (typeof window !== 'undefined') {
          router.push(`/t/${newMeObj.userSlug}`);
        }
      } else if (res.status === 303) {
        console.log('in 303-> user does not exist in our DB')
        setUserExistsInDB(false)
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
