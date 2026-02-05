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
import { useEffect, useState } from 'react';
import { handleError } from '@planet-sdk/common';
import GetPublicUserProfileMeta from '../../../../../src/utils/getMetaTags/GetPublicUserProfileMeta';

import { useApi } from '../../../../../src/hooks/useApi';
import { useErrorHandlingStore } from '../../../../../src/stores/errorHandlingStore';
import useLocalizedPath from '../../../../../src/hooks/useLocalizedPath';

interface Props {
  pageProps: PageProps;
}

const PublicProfilePage = ({ pageProps: { tenantConfig } }: Props) => {
  const { setTenantConfig } = useTenant();
  const { getApi } = useApi();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  //local state
  const [profile, setProfile] = useState<null | UserPublicProfile>(null);
  //store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  async function loadPublicProfile(slug: string) {
    try {
      const profileData = await getApi<UserPublicProfile>(
        `/app/profiles/${slug}`
      );
      setProfile(profileData);
    } catch (err) {
      setErrors(handleError(err as APIError));
      router.push(localizedPath('/'));
    }
  }

  useEffect(() => {
    if (
      router.isReady &&
      router.query.profile &&
      typeof router.query.profile === 'string'
    ) {
      // re-initiating the profile
      setProfile(null);
      loadPublicProfile(router.query.profile);
    }
  }, [router.isReady, router.query.profile]);

  return tenantConfig ? (
    <>
      <GetPublicUserProfileMeta userprofile={profile} />
      <PublicProfileOuterContainer>
        <PublicProfileLayout
          profile={profile}
          isProfileLoaded={profile !== null && profile !== undefined}
        />
      </PublicProfileOuterContainer>
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
