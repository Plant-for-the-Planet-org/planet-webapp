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

  const {userprofile,setUserprofile, userExistsInDB, setUserExistsInDB} = React.useContext(UserPropsContext);

  const [slug, setSlug] = React.useState(null);
  const [ready, setReady] = React.useState(false);

  const [publicUserProfle, setPublicUserProfile] = React.useState(null);
  const [authenticatedType, setAuthenticatedType] = React.useState('private');

  const [token, setToken] = React.useState('')
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    logout
  } = useAuth0();

  // This effect is used to get and update UserInfo if the isAuthenticated changes
  React.useEffect(() => {
    async function loadFunction() {
      const token = await getAccessTokenSilently();
      setToken(token);
    }
    if (isAuthenticated && !isLoading) {
      loadFunction()
    }
  }, [isAuthenticated, isLoading])

  const [forceReload, changeForceReload] = React.useState(false);
  const router = useRouter();
  
  useEffect(() => {
    if (router && router.query.id) {
      setUserprofile(null)
      setSlug(router.query.id);
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    async function loadUserData() {
      // For loading user data we first have to decide whether user is trying to load their own profile or someone else's
      // To do this we first try to fetch the slug from the local storage
      // If the slug matches and also there is token in the session we fetch the user's private data, else the public data
        const currentUserSlug = userprofile?.slug ? userprofile.slug : null;

        // some user logged in and slug matches -> private profile
        if (currentUserSlug !== slug || !userprofile) {
          //no user logged in or slug mismatch -> public profile
          const newPublicUserprofile = await getRequest(
            `/app/profiles/${slug}`
          );
          setAuthenticatedType('public');
          setPublicUserProfile(newPublicUserprofile);
        }
      }

    // ready is for router, loading is for session
    if (ready && !isLoading) {
      loadUserData();
    }
  }, [ready, isLoading, forceReload, isAuthenticated, router,slug]);

  const PublicUserProps = {
    userprofile: publicUserProfle?publicUserProfle:userprofile,
    changeForceReload,
    forceReload,
    authenticatedType,
    token,
  };


  function getUserProfile() {
    const profile = publicUserProfle?publicUserProfle:userprofile;
    if(profile?.type === 'tpo'){
      return (
        <>
          <GetPublicUserProfileMeta userprofile={profile} />
          <TPOProfile {...PublicUserProps} />
          <Footer />
        </>
      );
    }
    else if(profile?.type === 'individual' || profile?.type === 'education' || profile?.type === 'company'|| profile?.type === 'organization' || profile?.type === 'children-youth' || profile?.type === 'government'){
      return (
        <>
          <GetPublicUserProfileMeta userprofile={profile} />
          <IndividualProfile {...PublicUserProps} />
          <Footer />
        </>
      );
    }

  }

  if (initialized && (userprofile || publicUserProfle) && ready) {
    return getUserProfile()
  } else {
    return <UserProfileLoader />;
  }
}
