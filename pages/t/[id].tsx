import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import TPOProfile from '../../src/features/user/UserProfile/screens/TpoProfile';
import GetPublicUserProfileMeta from '../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import Footer from '../../src/features/common/Layout/Footer';
import IndividualProfile from '../../src/features/user/UserProfile/screens/IndividualProfile';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import { getRequest } from '../../src/utils/apiRequests/api';

interface Props {}

export default function PublicUser({}: Props) {
  console.log('page loading started');
  const { userprofile, isLoaded } = React.useContext(UserPropsContext);
  const [isLoadingData, setIsLoadingData] = React.useState(false);
  // const [publicUserProfile, setPublicUserProfile] = React.useState(null);
  const [authenticatedType, setAuthenticatedType] = React.useState('public');
  const [profile, setProfile] = React.useState(null);
  const [slug, setSlug] = React.useState(null);
  const [ready, setReady] = React.useState(false);

  const [forceReload, changeForceReload] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router && router.query.id) {
      setProfile(null);
      setSlug(router.query.id);
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    async function loadUserData() {
      setIsLoadingData(true);
      const currentUserSlug = userprofile?.slug ? userprofile.slug : null;
      if (userprofile && currentUserSlug === slug) {
        setProfile(userprofile);
        setAuthenticatedType('private');
      } else {
        //no user logged in or slug mismatch -> public profile
        const publicUserProfile = await getRequest(`/app/profiles/${slug}`);
        setAuthenticatedType('public');
        setProfile(publicUserProfile);
      }
      setIsLoadingData(false);
    }

    console.log('before loading user data');

    console.log('router?.query?.id', router?.query?.id);
    console.log('isLoaded', isLoaded);
    console.log('profile', profile);

    if (ready && isLoaded) {
      console.log('start loading user data');

      console.log('router?.query?.id', router?.query?.id);
      console.log('isLoaded', isLoaded);
      console.log('profile', profile);
      loadUserData();
      console.log('after loading user data');

      console.log('router?.query?.id', router?.query?.id);
      console.log('isLoaded', isLoaded);
      console.log('profile', profile);
    }
  }, [ready, slug, forceReload, router, isLoaded, userprofile]);

  const PublicUserProps = {
    userprofile: profile,
    changeForceReload,
    forceReload,
    authenticatedType,
  };

  function getUserProfile() {
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

  // if (profile && !isLoadingData) {
  //   return getUserProfile();
  // } else {
  //   return <UserProfileLoader />;
  // }

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
