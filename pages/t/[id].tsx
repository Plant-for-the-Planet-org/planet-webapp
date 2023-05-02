import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { useUserProps } from '../../src/features/common/Layout/UserPropsContext';
import { getRequest } from '../../src/utils/apiRequests/api';
import GetPublicUserProfileMeta from '../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import Footer from '../../src/features/common/Layout/Footer';
import Profile from '../../src/features/user/Profile';
import MyTrees from '../../src/features/user/Profile/components/MyTrees/MyTrees';
import ProjectsContainer from '../../src/features/user/Profile/ProjectsContainer';
import { ErrorHandlingContext } from '../../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths } from 'next';
import { handleError, APIError } from '@planet-sdk/common';
import { PublicUser } from '../../src/features/common/types/user';

function User(): ReactElement {
  // External imports
  const router = useRouter();
  const { user, contextLoaded, token } = useUserProps();
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);

  // Internal states
  const [profile, setProfile] = React.useState<null | PublicUser>();
  const [authenticatedType, setAuthenticatedType] = React.useState('');

  // Loads the public user profile
  async function loadPublicProfile(id: any) {
    try {
      const profileData = await getRequest<PublicUser>(`/app/profiles/${id}`);
      setProfile(profileData);
      setAuthenticatedType('public');
    } catch (err) {
      setErrors(handleError(err as APIError));
      redirect('/');
    }
  }

  useEffect(() => {
    if (router && router.isReady && router.query.id && contextLoaded) {
      // reintiating the profile
      setProfile(null);
      // Check if the user is authenticated and trying to access their own profile
      if (user && user.slug === router.query.id) {
        router.replace('/profile');
      }
      // If user is not access their own profile, load the public profile
      else {
        loadPublicProfile(router.query.id as string);
      }
    }
  }, [contextLoaded, user, router]);

  return profile ? (
    <>
      <GetPublicUserProfileMeta userprofile={profile} />
      <Profile userprofile={profile} authenticatedType={authenticatedType} />
      {profile && profile.type !== 'tpo' && (
        <MyTrees
          authenticatedType={authenticatedType}
          profile={profile}
          token={token}
        />
      )}
      {profile && profile.type === 'tpo' && (
        <ProjectsContainer profile={profile} />
      )}
      <Footer />
    </>
  ) : (
    <UserProfileLoader />
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}

export default User;
