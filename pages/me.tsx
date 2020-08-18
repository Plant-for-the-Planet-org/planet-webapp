import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Footer from '../src/features/common/Footer';
import Layout from '../src/features/common/Layout';
import UserPage from '../src/features/public/UserProfile';

export default function UserProfile() {
  const [userprofile, setUserprofile] = React.useState({});

  const UserProps = {
    userprofile: userprofile,
  };
  useEffect(() => {
    async function loadUserData() {
      // dummy data
      let userprofile = {
        countTarget : 200,
        countPlanted: 50,
        displayName: 'John Doe',
        description: "I grew up planting trees with Plant-for-the-Planet and since 2013, we've planted over 6 Million trees near my hometown in Yucantan. Join the app and plant some more!",
        isMe : true
      }
      setUserprofile(userprofile);
    }
    loadUserData();
  }, []);

  return (
    <Layout>
      <UserPage {...UserProps} />

      <Footer />
    </Layout>
  ) ;
}
