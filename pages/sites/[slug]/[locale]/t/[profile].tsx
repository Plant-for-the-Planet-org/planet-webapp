// This page will be moved to a different place in the future, as it is not a part of the user dashboard
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { APIError, UserPublicProfile } from '@planet-sdk/common';

import { constructPathsForTenantSlug } from '../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import PublicProfileOuterContainer from '../../../../../src/features/user/Profile/PublicProfileOuterContainer';
import PublicProfileLayout from '../../../../../src/features/user/Profile/PublicProfileLayout';
import { v4 } from 'uuid';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ErrorHandlingContext } from '../../../../../src/features/common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import GetPublicUserProfileMeta from '../../../../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import { ProjectsProvider } from '../../../../../src/features/projectsV2/ProjectsContext';
import { useApi } from '../../../../../src/hooks/useApi';
import { useTenantStore } from '../../../../../src/stores/tenantStore';

const PublicProfilePage = () => {
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const { getApi } = useApi();
  const router = useRouter();
  // local state
  const [profile, setProfile] = useState<null | UserPublicProfile>(null);
  // store: state
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  async function loadPublicProfile(slug: string) {
    try {
      const profileData = await getApi<UserPublicProfile>(
        `/app/profiles/${slug}`
      );
      setProfile(profileData);
    } catch (err) {
      setErrors(handleError(err as APIError));
      redirect('/');
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

  if (!tenantConfig) return null;

  return (
    <>
      <GetPublicUserProfileMeta userprofile={profile} />
      <PublicProfileOuterContainer>
        <ProjectsProvider>
          <PublicProfileLayout
            profile={profile}
            isProfileLoaded={profile !== null && profile !== undefined}
          />
        </ProjectsProvider>
      </PublicProfileOuterContainer>
    </>
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
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
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
    },
  };
};
