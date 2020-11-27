import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import TPOProfile from '../../src/features/user/UserProfile/screens/TpoProfile';
import GetPublicUserProfileMeta from '../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import Footer from '../../src/features/common/Layout/Footer';
import { getRequest } from '../../src/utils/apiRequests/api';
import IndividualProfile from '../../src/features/user/UserProfile/screens/IndividualProfile';
import {
  setUserExistsInDB,
  removeUserExistsInDB,
} from '../../src/utils/auth0/localStorageUtils';
import { getAccountInfo } from '../../src/utils/auth0/apiRequests'
import { useAuth0 } from '@auth0/auth0-react';
import { getUserInfo } from '../../src/utils/auth0/userInfo';

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
  };

  const logoutUser = () => {
    localStorage.removeItem('userInfo');
    logout();
  }

  useEffect(() => {
    if (router && router.query.id) {
      setSlug(router.query.id);
      setReady(true);
    }
  }, [router]);
  useEffect(() => {
    async function loadUserData() {
      if (typeof Storage !== 'undefined') {
        let token = null; 
        if(isAuthenticated){
          token = await getAccessTokenSilently();
        }
        let userInfo;
        userInfo = await getUserInfo(token, router, logout)
        let currentUserSlug = userInfo.slug ? userInfo.slug : null;
        
        // some user logged in and slug matches -> private profile
        if (!isLoading && token && currentUserSlug === slug) {          
          try {
            const res = await getAccountInfo(token)
            if (res.status === 200) {
              // console.log('in 200-> user exists in our DB');
              const resJson = await res.json();
              setAuthenticatedType('private')
              setUserprofile(resJson);
            } else if (res.status === 303) {
              // if 303 -> user doesn not exist in db
              // console.log('in 303-> user does not exist in our DB')
              setUserExistsInDB(false)
              if (typeof window !== 'undefined') {
                router.push('/complete-signup');
              }
            } else if (res.status === 401) {
              // in case of 401 - invalid token: signIn()
              // console.log('in 401-> unauthenticated user / invalid token')
              logoutUser();
              removeUserExistsInDB()
              loginWithRedirect();
            } else {
              // any other error
              // console.log('in else -> other error')
            }
          } catch (e) { }
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
  }, [ready, isLoading, forceReload, isAuthenticated]);

  function getUserProfile() {
    switch (userprofile?.type) {
      case 'tpo':
        return (
          <>
            <GetPublicUserProfileMeta userprofile={userprofile} />
            <TPOProfile {...PublicUserProps} />
            <Footer />
          </>
        );
      case 'individual':
        return (
          <>
            <GetPublicUserProfileMeta userprofile={userprofile} />
            <IndividualProfile {...PublicUserProps} />
            <Footer />
          </>
        );
      default: return null;
    }
  }

  if (initialized && (userprofile)) {
    return getUserProfile()
  } else {
    return <UserProfileLoader />;
  }
}
