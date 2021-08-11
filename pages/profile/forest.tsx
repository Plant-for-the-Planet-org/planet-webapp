import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import MyTrees from '../../src/features/user/Profile/components/MyTrees/MyTrees';

function ProfilePage(): ReactElement {
  // External imports
  const router = useRouter();
  const { user, contextLoaded, token } = React.useContext(UserPropsContext);

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
        <MyTrees
          authenticatedType={authenticatedType}
          profile={profile}
          token={token}
        />
      </UserLayout>
  ) : (
    <UserProfileLoader />
  );
}

export default ProfilePage;
