import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import Profile from '../../src/features/user/Profile';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import MyTrees from '../../src/features/user/Profile/components/MyTrees/MyTrees';
import Head from 'next/head';

function ProfilePage(): ReactElement {
  // External imports
  const router = useRouter();
  const { user, contextLoaded, token } = React.useContext(UserPropsContext);

  // Internal states
  const [profile, setProfile] = React.useState<null | Object>();
  const [authenticatedType, setAuthenticatedType] = React.useState('');

  useEffect(() => {
    if (contextLoaded) {
      if (user) {
        setProfile(user);
        setAuthenticatedType('private');
      }
    }
  }, [contextLoaded, user, router]);

  return (
    <UserLayout>
      <Head>
        <title>{`Profile`}</title>
      </Head>
      {profile && (
        <>
          <Profile
            userprofile={profile}
            authenticatedType={authenticatedType}
          />
          <MyTrees
            authenticatedType={authenticatedType}
            profile={profile}
            token={token}
          />
        </>
      )}
    </UserLayout>
  );
}

export default ProfilePage;
