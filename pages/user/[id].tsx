import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Footer from '../../src/features/common/Footer';
import Layout from '../../src/features/common/Layout';
import UserPage from '../../src/features/public/UserProfile';

export default function UserProfile() {
  const [userprofile, setUserprofile] = React.useState();

  const router = useRouter();
  const UserProps = {
    userprofile: userprofile,
  };
  useEffect(() => {
    async function loadUserData() {
      const res = await fetch(
        `${process.env.API_ENDPOINT}/public/v1.0/en/treecounter/${router.query.id}`
      );

      const userprofile = await res.json();
      setUserprofile(userprofile);
    }
    loadUserData();
  }, []);
  return userprofile ? (
    <Layout>
      <UserPage {...UserProps} />
      <Footer />
    </Layout>
  ) : null;
}
