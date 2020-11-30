import { useSession, signIn, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../src/features/common/Layout';
import tenantConfig from '../tenant.config';
import Head from 'next/head';
import UserProfileLoader from '../src/features/common/ContentLoaders/UserProfile/UserProfile';
import {setUserExistsInDB, removeUserExistsInDB, setUserInfo, removeUserInfo} from '../src/utils/auth0/localStorageUtils'
import { getAccountInfo } from '../src/utils/auth0/apiRequests'
import i18next from '../i18n'
import NetworkFailure from '../src/features/common/ErrorComponents/NetworkFailure';

const config = tenantConfig();

const { useTranslation } = i18next;

export default function Login() {
  const [session, loading] = useSession();
  const router = useRouter();
  const [network, setNetwork] = React.useState(false);

  const { t } = useTranslation(['login']);

  const fetchInfoFromBackend = async () => {
    try {
      const res = await getAccountInfo(session);
      if (res.status === 200) {
        // console.log('in 200-> user exists in our DB')
        //if 200-> user exists in db
        const resJson = await res.json();
        setUserExistsInDB(true)
        const userInfo = {
          slug: resJson.slug,
          profilePic: resJson.image,
          type: resJson.type
        }
        setUserInfo(userInfo)
        if (typeof window !== 'undefined') {
          router.push(`/t/${resJson.slug}`);
        }
      } else if (res.status === 303) {
        // if 303 -> user doesn not exist in db
        // console.log('in 303-> user does not exist in our DB')
        setUserExistsInDB(false)
        if (typeof window !== 'undefined') {
          router.push('/complete-signup');
        }
      } else if (res.status === 401){
        // console.log('in 401-> unauthenticated user / invalid token')
        signOut()
        removeUserExistsInDB()
        removeUserInfo()
        router.push('/');
      } else {
        // console.log('in /login else -> any other error')
      }
    } catch (e){
      setNetwork(true)
      console.log(e, 'login')
    }
  }
  React.useEffect(()=> {

    fetchInfoFromBackend();
  // no user present -> start login flow
    if (!loading && !session) {
      signIn('auth0', { callbackUrl: '/login' });
    }

  // some user present
  if (!loading && session){
    fetchInfoFromBackend()
  }
  }, [loading])

  const handleNetwork = () => {
    setNetwork(!network);
  };

  return (
    <>
      <Head>
        {/* <title>{t('login:loginTitle', {
          log: config.meta.title
        })}</title> */}
        <title>{`${config.meta.title} - Login`}</title>
      </Head>
      <Layout>
        <UserProfileLoader />
        {network && (
          <div
            style={{ position: 'fixed', bottom: 0, left: 0 }}
          >
            <NetworkFailure refresh={fetchInfoFromBackend()} handleNetwork={handleNetwork} />
          </div>
        )}
      </Layout>
    </>
  );
}
