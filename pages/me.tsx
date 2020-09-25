import { signIn, signOut, useSession, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { getMe } from '../public/locales/getTranslations';
import Layout from '../src/features/common/Layout';
import UserPage from '../src/features/user/UserProfile';
import tenantConfig from '../tenant.config';

const config = tenantConfig();
export default function UserProfile() {
  const router = useRouter();
  const [userprofile, setUserprofile] = React.useState({});
  const [ session, loading ] = useSession()
  const UserProps = {
    userprofile,
  };

  const texts = getMe();
  // dummy data
  const dummyProfile = {
    countTarget: 200,
    countPlanted: 50,
    displayName: 'John Doe',
    description:
      "I grew up planting trees with Plant-for-the-Planet and since 2013, we've planted over 6 Million trees near my hometown in Yucantan. Join the app and plant some more!",
    isMe: true,
    myForest: [
      {
        id: 1,
        name: 'Eden Reforestration Projects',
        country: 'Nepal',
        gift: 'Gift to Sam Williams',
        date: '10 February 2018',
      },
      {
        id: 2,
        name: 'Global Forest Generation',
        country: 'Chile',
        date: '10 April 2019',
      },
      {
        id: 3,
        name: 'Yucantan Reforestration',
        country: 'Mexico',
        gift: 'Gift to Sam Williams',
      },
      {
        id: 4,
        name: 'Global Forest Generation',
        country: 'Chile',
        date: '10 April 2019',
      },
      {
        id: 5,
        name: 'Yucantan Reforestration',
        country: 'Mexico',
        gift: 'Gift to Sam Williams',
        date: '10 April 2019',
      },
      {
        id: 6,
        name: 'Eden Reforestration Projects',
        country: 'Nepal',
        gift: 'Gift to Sam Williams',
        date: '10 February 2018',
      },
      {
        id: 7,
        name: 'Yucantan Reforestration',
        country: 'Mexico',
        gift: 'Gift to Sam Williams',
        date: '10 April 2019',
      },
    ],
  };
  useEffect(() => {
    async function loadUserData() {
      // here, API call
      setUserprofile(dummyProfile);
    }
    loadUserData();
  }, []);

  if (!config.header.items[3].visible) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
  }
  if (!session && !loading){
  return (
    <Layout>
      <br />
      <br />
      <br />
      <a
        href={`/api/auth/signin/`}
        onClick={(e) => {
          e.preventDefault();
          signIn(null, { callbackUrl: 'http://localhost:3000/me'});
        }}
      >
        Sign In
      </a>{' '}
      {console.log('session', session)}
      <h1> session : {session}</h1>
    </Layout>
  );
  }
  else {
    return (
      <Layout>
        <h2 style={{ marginTop: '80px' }}>
          description:
          {texts.description}
          {/* Signed in as {JSON.stringify(session)} */}
        </h2>
        <h1> session : {JSON.stringify(session)}</h1>
        <button onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
        <UserPage
          style={{ height: '100vh', overflowX: 'hidden' }}
          {...UserProps}
        />
      </Layout>
    );
  }
};