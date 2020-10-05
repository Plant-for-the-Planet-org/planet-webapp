import { signIn, signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../src/features/common/Layout';
import UserPage from '../src/features/user/UserProfile';
import tenantConfig from '../tenant.config';

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
const config = tenantConfig();

interface Props {
  initialized: Boolean;
}

export default function UserProfile(initialized: Props) {
  const router = useRouter();
  const [userprofile, setUserprofile] = useState({});
  const [session, loading] = useSession();
  const [pageLoading, setPageLoading] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(false);
  const UserProps = {
    userprofile,
    setReloadFlag,
    reloadFlag,
  };
  useEffect(() => {
    if (!loading && session && session.userprofile) {
      setUserprofile(session.userprofile);
    }
    // if session present but user not signed up
    if (!loading && session && !session.userprofile) {
      if (typeof window !== 'undefined') {
        router.push('/complete-signup');
      }
    }
  }, [loading]);

  if (!config.header.items[3].visible) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
  }
  // unauthenticated user
  if (!loading && !session) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
  }
  // if session present but user not signed up
  if (!loading && session && !session.userprofile) {
    if (typeof window !== 'undefined') {
      router.push('/complete-signup');
    }
  }

  if (!initialized || loading) {
    return <React.Fragment />;
  }
  if (!loading && session && session.userprofile) {
    return (
      <Layout>
        <UserPage
          style={{ height: '100vh', overflowX: 'hidden' }}
          {...UserProps}
        />
      </Layout>
    );
  }
}
