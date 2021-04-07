import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import TPOProfile from '../../src/features/user/UserProfile/screens/TpoProfile';
import GetPublicUserProfileMeta from '../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import Footer from '../../src/features/common/Layout/Footer';
import { getRequest, getAccountInfo } from '../../src/utils/apiRequests/api';
import IndividualProfile from '../../src/features/user/UserProfile/screens/IndividualProfile';
import {
  setUserExistsInDB,
  removeUserExistsInDB,
  getLocalUserInfo,
  removeLocalUserInfo,
} from '../../src/utils/auth0/localStorageUtils';
import { useAuth0 } from '@auth0/auth0-react';

interface Props {
  initialized: Boolean;
}

export default function PublicUser(initialized: Props) {

  // Whether public or private
  const [authenticatedType, setAuthenticatedType] = React.useState('');

  const [userprofile, setUserprofile] = React.useState();

  const [slug, setSlug] = React.useState(null);
  const [ready, setReady] = React.useState(false);

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
  const PublicUserProps = {
    userprofile,
    changeForceReload,
    forceReload,
    authenticatedType,
    token,
  };

  const logoutUser = () => {
    removeLocalUserInfo();
    logout({ returnTo: `${process.env.NEXTAUTH_URL}/` });
  }

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

      if (typeof Storage !== 'undefined') {
        let token = null;
        if (isAuthenticated) {
          token = await getAccessTokenSilently();
        }
        const userInfo = await getLocalUserInfo()
        const currentUserSlug = userInfo?.slug ? userInfo.slug : null;

        // some user logged in and slug matches -> private profile
        if (!isLoading && token && currentUserSlug === slug) {
          try {
            const res = await getAccountInfo(token)
            if (res.status === 200) {
              const resJson = await res.json();
              setAuthenticatedType('private')
              setUserprofile(resJson);
            } else if (res.status === 303) {
              // if 303 -> user doesn not exist in db
              setUserExistsInDB(false)
              if (typeof window !== 'undefined') {
                router.push('/complete-signup');
              }
            } else if (res.status === 401) {
              // in case of 401 - invalid token: signIn()
              logoutUser();
              removeUserExistsInDB()
              loginWithRedirect({redirectUri:`${process.env.NEXTAUTH_URL}/login`, ui_locales: localStorage.getItem('language') || 'en' });
            } else {
              // any other error
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          //no user logged in or slug mismatch -> public profile
          const newPublicUserprofile = await getRequest(
            `/app/profiles/${slug}`
          );
          setAuthenticatedType('public')
          setUserprofile(newPublicUserprofile);
        }
      }
    }

    // ready is for router, loading is for session
    if (ready && !isLoading) {
      loadUserData();
    }
  }, [ready, isLoading, forceReload, isAuthenticated, router,slug]);

  function getUserProfile() {
    if(userprofile?.type === 'tpo'){
      return (
        <>
          <GetPublicUserProfileMeta userprofile={userprofile} />
          <TPOProfile {...PublicUserProps} />
          <Footer />
        </>
      );
    }
    else if(userprofile?.type === 'individual' || userprofile?.type === 'education' || userprofile?.type === 'company'|| userprofile?.type === 'organization' || userprofile?.type === 'children-youth' || userprofile?.type === 'government'){
      return (
        <>
          <GetPublicUserProfileMeta userprofile={userprofile} />
          <IndividualProfile {...PublicUserProps} />
          <Footer />
        </>
      );
    }

  }

  if (initialized && (userprofile) && ready) {
    return getUserProfile()
  } else {
    return <UserProfileLoader />;
  }
}
