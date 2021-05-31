import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import TPOProfile from '../../src/features/user/UserProfile/screens/TpoProfile';
import GetPublicUserProfileMeta from '../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import Footer from '../../src/features/common/Layout/Footer';
import IndividualProfile from '../../src/features/user/UserProfile/screens/IndividualProfile';
import { useAuth0 } from '@auth0/auth0-react';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import { getRequest } from '../../src/utils/apiRequests/api';

interface Props {
  initialized: Boolean;
}

export default function PublicUser(initialized: Props) {
  const { userprofile, isLoaded } = React.useContext(UserPropsContext);
  const [isLoadingData, setIsLoadingData] = React.useState(false);
  const [publicUserProfle, setPublicUserProfile] = React.useState(null);
  const [authenticatedType, setAuthenticatedType] = React.useState('public');

  const [forceReload, changeForceReload] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadUserData() {
      // For loading user data we first have to decide whether user is trying to load their own profile or someone else's
      // To do this we first try to fetch the slug from the local storage
      // If the slug matches and also there is token in the session we fetch the user's private data, else the public data
      const currentUserSlug = userprofile?.slug ? userprofile.slug : null;
      // some user logged in and slug matches -> private profile
      if (userprofile && currentUserSlug === router.query.id) {
        setPublicUserProfile(null);
        setAuthenticatedType('private');
      } else {
        setIsLoadingData(true);
        //no user logged in or slug mismatch -> public profile
        const newPublicUserprofile = await getRequest(
          `/app/profiles/${router.query.id}`
        );
        setAuthenticatedType('public');
        setPublicUserProfile(newPublicUserprofile);
        setIsLoadingData(false);
      }
    }

    // ready is for router, loading is for session
    if (router && router.query.id && isLoaded) {
      loadUserData();
    }
  }, [forceReload, router, isLoaded, userprofile]);

  const PublicUserProps = {
    userprofile: publicUserProfle ? publicUserProfle : userprofile,
    changeForceReload,
    forceReload,
    authenticatedType,
  };

  function getUserProfile() {
    const profile = publicUserProfle ? publicUserProfle : userprofile;
    if (profile?.type === 'tpo') {
      return (
        <>
          <GetPublicUserProfileMeta userprofile={profile} />
          <TPOProfile {...PublicUserProps} />
          <Footer />
        </>
      );
    } else if (
      profile?.type === 'individual' ||
      profile?.type === 'education' ||
      profile?.type === 'company' ||
      profile?.type === 'organization' ||
      profile?.type === 'children-youth' ||
      profile?.type === 'government'
    ) {
      return (
        <>
          <GetPublicUserProfileMeta userprofile={profile} />
          <IndividualProfile {...PublicUserProps} />
          <Footer />
        </>
      );
    }
  }

  if (
    initialized &&
    isLoaded &&
    (userprofile || publicUserProfle) &&
    !isLoadingData
  ) {
    return getUserProfile();
  } else {
    return <UserProfileLoader />;
  }
}
