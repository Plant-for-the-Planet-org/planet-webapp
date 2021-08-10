import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import Profile from '../../src/features/user/Profile';
import UserLayout from '../../src/features/user/UserLayout';

function ProfilePage(): ReactElement {
  // External imports
  const router = useRouter();
  const { user, contextLoaded } = React.useContext(UserPropsContext);

  // Internal states
  const [profile, setProfile] = React.useState<null | Object>();
  const [authenticatedType, setAuthenticatedType] = React.useState('');

  useEffect(() => {
    if (user && contextLoaded) {
      setProfile(user);
      setAuthenticatedType('private');
    }
  }, [contextLoaded, user]);

  return profile ? (
    <UserLayout>
      <Profile userprofile={profile} authenticatedType={authenticatedType} />
    </UserLayout>
  ) : (
    <UserProfileLoader />
  );
}

export default ProfilePage;
