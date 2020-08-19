import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Footer from '../src/features/common/Footer';
import Layout from '../src/features/common/Layout';
import UserPage from '../src/features/user/UserProfile';

export default function UserProfile() {
  const [userprofile, setUserprofile] = React.useState({});

  const UserProps = {
    userprofile: userprofile,
  };

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

  return (
    <Layout>
      <UserPage {...UserProps} />
    </Layout>
  );
}
