import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/client';
import React, { useEffect } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import TPOProfile from '../../src/features/user/UserProfile/screens/TpoProfile';
import GetPublicUserProfileMeta from '../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import Footer from '../../src/features/common/Layout/Footer';
import { getRequest } from '../../src/utils/apiRequests/api';
import IndividualProfile from '../../src/features/user/UserProfile/screens/IndividualProfile';
import PrivateUserProfile from '../../src/features/user/UserProfile/screens/PrivateIndividualProfile';
import {
  getUserExistsInDB,
  getUserSlug,
} from '../../src/utils/auth0/localStorageUtils';
import {getAccountInfo } from '../../src/utils/auth0/getAccountInfo'

interface Props {
  initialized: Boolean;
}

export default function PublicUser(initialized: Props) {
  const [session, loading] = useSession();
  const [publicUserprofile, setPublicUserprofile] = React.useState();
  const [privateUserprofile, setPrivateUserprofile] = React.useState();
  const [slug, setSlug] = React.useState(null);
  const [ready, setReady] = React.useState(false);
  const [forceReload, changeForceReload] = React.useState(false);

  const router = useRouter();
  const PublicUserProps = {
    publicUserprofile,
  };
  const PrivateUserProps = {
    privateUserprofile,
    changeForceReload,
    forceReload,
  };

  useEffect(() => {
    if (router && router.query.id !== undefined) {
      setSlug(router.query.id);
      setReady(true);
    }
  }, [router]);
  useEffect(() => {
    async function loadUserData() {
      if (typeof Storage !== 'undefined') {
        const userExistsInDB = getUserExistsInDB();
        const currentUserSlug = getUserSlug();

        // some user logged in and slug matches -> private profile
        if (!loading && session && userExistsInDB && currentUserSlug === slug) {
          try {
            const res = await getAccountInfo(session)
            if (res.status === 200) {
              console.log('in 200-> user exists in our DB');
              const resJson = await res.json();
              const newMeObj = {
                ...resJson,
                userSlug: 'trial-slug',
                isMe: true,
              };
              setPrivateUserprofile(newMeObj);
            } else {
              console.log('in else /t/[id]')
              // TODO: token expired : signIn(....)
            }
          } catch (e) {}
        } else {
          //no user logged in or slug mismatch -> public profile
          const newPublicUserprofile = await getRequest(
            `/public/v1.0/en/treecounter/${slug}`
          );
          setPublicUserprofile(newPublicUserprofile);
        }
      }
    }
    
    // ready is for router, loading is for session
    if (ready && !loading) {
      loadUserData();
    }
  }, [ready, loading, forceReload]);

  function getPublicUserProfile() {
    switch (publicUserprofile?.userProfile.type) {
      case 'tpo':
        return (
          <>
            <GetPublicUserProfileMeta publicUserprofile={publicUserprofile} />
            <TPOProfile {...PublicUserProps} />
            <Footer />
          </>
        );
      case 'individual':
        return (
          <>
            <GetPublicUserProfileMeta publicUserprofile={publicUserprofile} />
            <IndividualProfile {...PublicUserProps} />
            <Footer />
          </>
        );
    }
  }

  if (initialized && (publicUserprofile || privateUserprofile)) {
    if (publicUserprofile) {
      return getPublicUserProfile();
    } else if (privateUserprofile) {
      return (
        <>
          <PrivateUserProfile
            style={{ height: '100vh', overflowX: 'hidden' }}
            {...PrivateUserProps}
          />
          <Footer />
        </>
      );
    }
  } else {
    return <UserProfileLoader />;
  }
}
