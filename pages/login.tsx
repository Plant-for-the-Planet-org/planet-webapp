import { useSession, signIn, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../src/features/common/Layout';
import tenantConfig from '../tenant.config';
import Head from 'next/head';
import UserProfileLoader from '../src/features/common/ContentLoaders/UserProfile/UserProfile';
import {setUserSlug, setUserExistsInDB, removeUserExistsInDB, removeUserSlug} from '../src/utils/auth0/localStorageUtils'
import { getAccountInfo } from '../src/utils/auth0/getAccountInfo'
const config = tenantConfig();

export default function Login() {
  const [session, loading] = useSession();
  const router = useRouter();

  React.useEffect(()=> {

  const fetchInfoFromBackend = async () => {
    try {
      const res = await getAccountInfo(session);
      if (res.status === 200) {
        console.log('in 200-> user exists in our DB')
        //if 200-> user exists in db
        const resJson = await res.json();
        setUserExistsInDB(true)
        setUserSlug(resJson.slug)
        if (typeof window !== 'undefined') {
          router.push(`/t/${resJson.slug}`);
        }
      } else if (res.status === 303) {
        // if 303 -> user doesn not exist in db
        console.log('in 303-> user does not exist in our DB')
        setUserExistsInDB(false)
        if (typeof window !== 'undefined') {
          router.push('/complete-signup');
        }
      } else if (res.status === 401){
        console.log('in 401-> unauthenticated user / invalid token')
        signOut()
        removeUserExistsInDB()
        removeUserSlug()
        signIn('auth0', { callbackUrl: '/login' });
      } else {
        console.log('in /login else -> any other error')
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
