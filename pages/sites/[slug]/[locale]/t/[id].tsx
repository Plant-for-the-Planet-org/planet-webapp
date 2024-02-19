import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import { UserProfileLoader } from '../../../../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { useUserProps } from '../../../../../src/features/common/Layout/UserPropsContext';
import { getRequest } from '../../../../../src/utils/apiRequests/api';
import GetPublicUserProfileMeta from '../../../../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import Footer from '../../../../../src/features/common/Layout/Footer';
import Profile from '../../../../../src/features/user/ProfileV2/components/ProfileInfo';
import ProjectsContainer from '../../../../../src/features/user/ProfileV2/components/ProjectDetails/ProjectsContainer';
import { ErrorHandlingContext } from '../../../../../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { handleError, APIError, UserPublicProfile } from '@planet-sdk/common';
import MyContributions from '../../../../../src/features/user/ProfileV2/components/MyContributions/MyContributions';
import { MyForestProvider } from '../../../../../src/features/common/Layout/MyForestContext';
import PlantedTreesContributions from '../../../../../src/features/user/ProfileV2/components/ProjectDetails/PlantedTreesContributions';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import { defaultTenant } from '../../../../../tenant.config';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import myProfileStyle from '../../../../../src/features/user/ProfileV2/styles/MyProfile.module.scss';
interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
}

function PublicProfile({ pageProps: { tenantConfig } }: Props): ReactElement {
  // External imports
  const router = useRouter();
  const { user, contextLoaded, token } = useUserProps();
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const { setTenantConfig } = useTenant();

  // Internal states
  const [profile, setProfile] = React.useState<null | UserPublicProfile>(null);

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  // Loads the public user profile
  async function loadPublicProfile(id: string) {
    try {
      const profileData = await getRequest<UserPublicProfile>(
        tenantConfig.id,
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
  return tenantConfig && profile ? (
    <MyForestProvider>
      <GetPublicUserProfileMeta userprofile={profile} />
      <div className={myProfileStyle.publicProfileMainContainer}>
        <Profile userProfile={profile} />
        {profile.type === 'tpo' && (
          <PlantedTreesContributions userProfile={profile} />
        )}

        {profile && profile.type !== 'tpo' && (
          <MyContributions profile={profile} token={token} />
        )}
        {profile && profile.type === 'tpo' && (
          <ProjectsContainer profile={profile} />
        )}
        <Footer />
      </div>
    </MyForestProvider>
  ) : (
    <UserProfileLoader />
  );
}

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        id: v4(),
        locale: 'en',
      },
    };
  });

  return {
    paths: paths,
    fallback: 'blocking',
  };
};

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
          'profile',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
      tenantConfig,
    },
  };
};

export default PublicProfile;
