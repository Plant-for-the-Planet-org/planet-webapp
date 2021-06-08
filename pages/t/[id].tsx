import { useRouter } from 'next/router';
import React, { useEffect, ReactElement } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import TPOProfile from '../../src/features/user/UserProfile/screens/TpoProfile';
import GetPublicUserProfileMeta from '../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import Footer from '../../src/features/common/Layout/Footer';
import { getRequest } from '../../src/utils/apiRequests/api';
import IndividualProfile from '../../src/features/user/UserProfile/screens/IndividualProfile';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';

interface Props {
  initialized: Boolean;
}

export default function PublicUser(initialized: Props) {
  const isServer = () => typeof window === 'undefined';
  return <>{!isServer() && <ProfileComponent />}</>;
}

function ProfileComponent(): ReactElement {
  const [authenticatedType, setAuthenticatedType] = React.useState('');
  const [profile, setProfile] = React.useState<null | Object>();
  const [slug, setSlug] = React.useState<null | string | string[]>();
  const [ready, setReady] = React.useState(false);

  const { user, contextLoaded, token } = React.useContext(UserPropsContext);

  const [forceReload, changeForceReload] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router && router.query.id) {
      setSlug(router.query.id);
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    async function loadPublicProfile() {
      const profileData = await getRequest(`/app/profiles/${slug}`);
      setProfile(profileData);
      setAuthenticatedType('public');
    }

    if (ready && contextLoaded) {
      setProfile(null);
      if (user) {
        const currentUserSlug = user?.slug ? user.slug : null;
        if (user && currentUserSlug === slug) {
          setProfile(user);
          setAuthenticatedType('private');
        } else {
          loadPublicProfile();
        }
      } else {
        loadPublicProfile();
      }
    }
  }, [ready, contextLoaded, forceReload, slug, user]);

  const PublicUserProps = {
    userprofile: profile,
    changeForceReload,
    forceReload,
    authenticatedType,
    token,
  };
  return (
    <>
      {profile ? (
        <>
          <GetPublicUserProfileMeta userprofile={profile} />
          {profile?.type === 'tpo' ? (
            <TPOProfile {...PublicUserProps} />
          ) : (
            <IndividualProfile {...PublicUserProps} />
          )}
          <Footer />
        </>
      ) : (
        <UserProfileLoader />
      )}
    </>
  );
}
