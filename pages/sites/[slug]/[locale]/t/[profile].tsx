// This page will be moved to a different place in the future, as it is not a part of the user dashboard
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { APIError, UserPublicProfile } from '@planet-sdk/common';

import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { defaultTenant } from '../../../../../tenant.config';
import PublicProfileOuterContainer from '../../../../../src/features/user/Profile/PublicProfileOuterContainer';
import PublicProfileLayout from '../../../../../src/features/user/Profile/PublicProfileLayout';
import { v4 } from 'uuid';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import { useRouter } from 'next/router';
import { MyForestProvider } from '../../../../../src/features/common/Layout/MyForestContext';
import { useContext, useEffect, useState } from 'react';
import { ErrorHandlingContext } from '../../../../../src/features/common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import { getRequest } from '../../../../../src/utils/apiRequests/api';
import GetPublicUserProfileMeta from '../../../../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import { ProjectsProvider } from '../../../../../src/features/projectsV2/ProjectsContext';

interface Props {
  pageProps: PageProps;
}

const PublicProfilePage = ({ pageProps: { tenantConfig } }: Props) => {
  const { setTenantConfig } = useTenant();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const [profile, setProfile] = useState<null | UserPublicProfile>(null);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  async function loadPublicProfile(slug: string) {
    try {
      const profileData = await getRequest<UserPublicProfile>({
        tenant: tenantConfig.id,
        url: `/app/profiles/${slug}`,
      });
      setProfile(profileData);
    } catch (err) {
      setErrors(handleError(err as APIError));
      redirect('/');
    }
  }

  useEffect(() => {
    if (router?.isReady && router?.query?.profile) {
      // reintiating the profile
      setProfile(null);
      loadPublicProfile(router.query.profile as string);
    }
  }, [router]);

  return tenantConfig ? (
    <>
      <GetPublicUserProfileMeta userprofile={profile} />
      <MyForestProvider>
        <PublicProfileOuterContainer>
          <ProjectsProvider>
            <PublicProfileLayout
              profile={profile}
              isProfileLoaded={profile !== null}
            />
          </ProjectsProvider>
        </PublicProfileOuterContainer>
      </MyForestProvider>
    </>
  ) : (
    <></>
  );
};

export default PublicProfilePage;

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths =
    subDomainPaths?.map((path) => {
      return {
        params: {
          slug: path.params.slug,
          locale: 'en',
          profile: v4(),
        },
      };
    }) ?? [];

  return {
    paths,
    fallback: 'blocking',
  };
};

interface PageProps {
  messages: AbstractIntlMessages;
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: [
      'common',
      'me',
      'country',
      'donate',
      'profile',
      'project',
      'projectDetails',
      'allProjects',
    ],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
