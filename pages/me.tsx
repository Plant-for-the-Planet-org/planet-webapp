import { signIn, signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
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
  const [userprofile, setUserprofile] = React.useState({});
  const [ session, loading] = useSession()
  const [pageLoading, setPageLoading] = React.useState(true)
  const UserProps = {
    userprofile,
  };
  useEffect(() => {
    async function fetchUserInfo(session:any) {
      try { 
      const res = await fetch(
        `${process.env.API_ENDPOINT}/app/accountInfo`, {
          headers: { 
            'Authorization': `OAuth ${session.accessToken}`
           },
           method: 'GET',
        },
      );
      if (res.status === 200){
        // user exists in db and ren info
        const resJson = await res.json()
        const newMeObj = {
          ...resJson,
          isMe: true,
        }
        setPageLoading(false)
        setUserprofile(newMeObj);
      } else if (res.status === 303){
        // user does not exist in db
        if (typeof window !== 'undefined') {
          router.push('/complete-signup');
        }
      }
    } catch { 
      console.log('Error')
    }
    }

    if (!loading && !session){
      setPageLoading(false)
      // user not logged in -> send to login screen
      signIn(null)
    } else if (!loading && session) {
      // some user is logged in -> api call to backend
      fetchUserInfo(session)
    }
  }, [loading]);

  if (!config.header.items[3].visible) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
  }
  if (!initialized) {
    return (<React.Fragment/>)
  }
  // loading
  if (pageLoading || loading){
    return(<h1>Loading...</h1>)
  }
  if (!loading && !session){
    return <h1> redirecting to login...</h1>
  }
  if (!pageLoading && !loading && session)
  {
    return (
      <Layout>
        <UserPage
          style={{ height: '100vh', overflowX: 'hidden' }}
          {...UserProps}
        />
      </Layout>
    );
  }
};
