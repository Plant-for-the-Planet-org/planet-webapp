import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import TPOProfile from '../../src/features/user/UserProfile/screens/TpoProfile';
import GetPublicUserProfileMeta from '../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import Footer from '../../src/features/common/Layout/Footer';
import IndividualProfile from '../../src/features/user/UserProfile/screens/IndividualProfile';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import { getRequest } from '../../src/utils/apiRequests/api';

interface Props {
  initialized: Boolean;
}

export default function PublicUser(initialized: Props) {
  const { userprofile, isLoaded } = React.useContext(UserPropsContext);
  const [isLoadingData, setIsLoadingData] = React.useState(false);
  const [publicUserProfile, setPublicUserProfile] = React.useState(null);
  const [authenticatedType, setAuthenticatedType] = React.useState('public');

  const [forceReload, changeForceReload] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadUserData() {
      const currentUserSlug = userprofile?.slug ? userprofile.slug : null;
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

    console.log('before loading user data');
    console.log('initialized', initialized);
    console.log('router?.query?.id', router?.query?.id);
    console.log('isLoaded', isLoaded);
    console.log('userprofile', userprofile);
    console.log('publicUserProfile', publicUserProfile);

    if (router && router.query.id && isLoaded) {
      console.log('start loading user data');
      console.log('initialized', initialized);
      console.log('router?.query?.id', router?.query?.id);
      console.log('isLoaded', isLoaded);
      console.log('userprofile', userprofile);
      loadUserData();
      console.log('after loading user data');
      console.log('initialized', initialized);
      console.log('router?.query?.id', router?.query?.id);
      console.log('isLoaded', isLoaded);
      console.log('userprofile', userprofile);
    }
  }, [forceReload, router, isLoaded, userprofile]);

  const PublicUserProps = {
    userprofile: publicUserProfile ? publicUserProfile : userprofile,
    changeForceReload,
    forceReload,
    authenticatedType,
  };

  function getUserProfile() {
    const profile = publicUserProfile ? publicUserProfile : userprofile;
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
    (userprofile || publicUserProfile) &&
    !isLoadingData
  ) {
    return getUserProfile();
  } else {
    return <UserProfileLoader />;
  }
}
