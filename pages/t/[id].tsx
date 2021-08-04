import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import { getRequest } from '../../src/utils/apiRequests/api';
import GetPublicUserProfileMeta from '../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import Footer from '../../src/features/common/Layout/Footer';
import Profile from '../../src/features/user/Profile';
import UserLayout from '../../src/features/user/UserLayout';

function User(): ReactElement {
  // External imports
  const router = useRouter();
  const { user, contextLoaded } = React.useContext(UserPropsContext);

  // Internal states
  const [profile, setProfile] = React.useState<null | Object>();
  const [authenticatedType, setAuthenticatedType] = React.useState('');

  // Loads the public user profile
  async function loadPublicProfile(id: any) {
    const profileData = await getRequest(`/app/profiles/${id}`);
    setProfile(profileData);
    setAuthenticatedType('public');
  }

  useEffect(() => {
    if (router && router.isReady && router.query.id && contextLoaded) {
      // reintiating the profile
      setProfile(null);
      // Check if the user is authenticated and trying to access their own profile
      if (user && user.slug === router.query.id) {
        setProfile(user);
        setAuthenticatedType('private');
      }
      // If user is not access their own profile, load the public profile
      else {
        loadPublicProfile(router.query.id);
      }
    }
  }, [contextLoaded, user, router]);

  return profile ? (
    <>
      <GetPublicUserProfileMeta userprofile={profile} />
      <UserLayout>
        <Profile userprofile={profile} authenticatedType={authenticatedType} />
        <Footer />
      </UserLayout>
    </>
  ) : (
    <UserProfileLoader />
  );
}

export default User;
