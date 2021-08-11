import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import DeleteProfile from '../../src/features/user/Settings/DeleteProfile';

function DeleteProfilePage(): ReactElement {
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
        <DeleteProfile/>
      </UserLayout>
  ) : (
    <UserProfileLoader />
  );
}

export default DeleteProfilePage;
