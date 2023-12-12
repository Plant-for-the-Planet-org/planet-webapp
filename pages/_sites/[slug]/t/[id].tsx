import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import UserProfileLoader from '../../../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { useUserProps } from '../../../../src/features/common/Layout/UserPropsContext';
import { getRequest } from '../../../../src/utils/apiRequests/api';
import GetPublicUserProfileMeta from '../../../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import Footer from '../../../../src/features/common/Layout/Footer';
import Profile from '../../../../src/features/user/ProfileV2';
import ProjectsContainer from '../../../../src/features/user/Profile/ProjectsContainer';
import { ErrorHandlingContext } from '../../../../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { handleError, APIError } from '@planet-sdk/common';
import { PublicUser } from '../../../../src/features/common/types/user';
import MyContributions from '../../../../src/features/user/ProfileV2/components/MyTrees/MyContributions';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import { defaultTenant } from '../../../../tenant.config';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
}

function SingleUser({ pageProps }: Props): ReactElement {
  // External imports
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  const { user, contextLoaded, token } = useUserProps();
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);

  // Internal states
  const [profile, setProfile] = React.useState<null | PublicUser>();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  // Loads the public user profile
  async function loadPublicProfile(id: string) {
    try {
      const profileData = await getRequest<PublicUser>(
        pageProps.tenantConfig.id,
        `/app/profiles/${id}`
      );
      setProfile(profileData);
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
  return pageProps.tenantConfig && profile ? (
    <>
      <GetPublicUserProfileMeta userprofile={profile} />
      <Profile userProfile={profile} />
      {profile && profile.type !== 'tpo' && (
        <MyContributions profile={profile} token={token} />
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

export async function getStaticPaths() {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        id: v4(),
      },
    };
  });

  return {
    paths: paths,
    fallback: 'blocking',
  };
}

interface StaticProps {
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<StaticProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<StaticProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale || 'en',
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
      tenantConfig,
    },
  };
};

export default SingleUser;
