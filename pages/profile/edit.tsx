import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import Footer from '../../src/features/common/Layout/Footer';
import UserLayout from '../../src/features/user/UserLayout';
import MyTrees from '../../src/features/user/Profile/components/MyTrees/MyTrees';
import EditProfileModal from '../../src/features/user/Profile/components/EditProfileModal';
import AccountFooter from '../../src/features/common/Layout/Footer/AccountFooter';

function EditProfilePage(): ReactElement {
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
        <EditProfileModal/>
        <AccountFooter />
      </UserLayout>
  ) : (
    <UserProfileLoader />
  );
}

export default EditProfilePage;
