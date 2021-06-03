import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import TPOProfile from '../../src/features/user/UserProfile/screens/TpoProfile';
import GetPublicUserProfileMeta from '../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import Footer from '../../src/features/common/Layout/Footer';
import IndividualProfile from '../../src/features/user/UserProfile/screens/IndividualProfile';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import { getRequest, getRequestNew } from '../../src/utils/apiRequests/api';
import { GetStaticPaths, GetStaticProps } from 'next';

interface Props {
  pageProps: Object;
}

export default function PublicUser({ pageProps }: Props) {
  console.log('page loading started');
  const { profileData } = pageProps;
  const { userprofile, isLoaded } = React.useContext(UserPropsContext);
  const [isLoadingData, setIsLoadingData] = React.useState(false);
  // const [publicUserProfile, setPublicUserProfile] = React.useState(null);
  const [authenticatedType, setAuthenticatedType] = React.useState('public');
  const [profile, setProfile] = React.useState(profileData);
  const [slug, setSlug] = React.useState(null);
  const [ready, setReady] = React.useState(false);

  const [forceReload, changeForceReload] = React.useState(false);
  const router = useRouter();

  if (router.isFallback) {
    return <UserProfileLoader />;
  }

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
        setAuthenticatedType('public');
        setProfile(profileData);
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

export const getStaticProps: GetStaticProps = async (context: any) => {
  const profileData = await getRequestNew(`/app/profiles/${context.params.id}`);
  console.log(profileData);

  return {
    props: {
      profileData,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 300 seconds
    revalidate: 60, // In seconds
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { id: any } }[] = [
    { params: { id: 'sarvesh-warge' } },
  ];
  return {
    paths: paths,
    fallback: true,
  };
};
