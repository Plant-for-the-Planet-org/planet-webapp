import React, { ReactElement, useEffect } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import MyTrees from '../../src/features/user/Profile/components/MyTrees/MyTrees';

function ProfilePage(): ReactElement {
  // External imports
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

  return (
    <UserLayout>
      {profile && (
        <MyTrees
          authenticatedType={authenticatedType}
          profile={profile}
          token={token}
        />
      )}
    </UserLayout>
  );
}

export default ProfilePage;
