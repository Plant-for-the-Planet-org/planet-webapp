// This page will be moved to a different place in the future, as it is not a part of the user dashboard
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { AbstractIntlMessages, useLocale } from 'next-intl';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { defaultTenant } from '../../../../../tenant.config';
import Head from 'next/head';
import PublicProfileOuterContainer from '../../../../../src/features/user/MFV2/PublicProfileOuterContainer';
import PublicProfileLayout from '../../../../../src/features/user/MFV2/PublicProfileLayout';
import { v4 } from 'uuid';
import { APIError, UserPublicProfile, handleError } from '@planet-sdk/common';
import { useState, useContext, useEffect } from 'react';
import { ErrorHandlingContext } from '../../../../../src/features/common/Layout/ErrorHandlingContext';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import { useUserProps } from '../../../../../src/features/common/Layout/UserPropsContext';
import { useRouter } from 'next/router';
import { getRequest } from '../../../../../src/utils/apiRequests/api';

interface Props {
  pageProps: PageProps;
}

const PublicProfilePage = ({ pageProps: { tenantConfig } }: Props) => {
  const [profile, setProfile] = useState<null | UserPublicProfile>();
  const { user, contextLoaded } = useUserProps();
  const { redirect, setErrors } = useContext(ErrorHandlingContext);
  const { setTenantConfig } = useTenant();
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
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
    if (router && router.isReady && router.query.profile && contextLoaded) {
      // reintiating the profile
      setProfile(null);
      // Check if the user is authenticated and trying to access their own profile
      if (user && user.slug === router.query.profile) {
        router.replace(encodeURI(`/${locale}/profile/mfv2`));
      }
      // If user is not access their own profile, load the public profile
      else {
        loadPublicProfile(router.query.profile as string);
      }
    }
  }, [contextLoaded, user, router]);

  return tenantConfig && profile ? (
    <>
      <Head>
        <title>My Forest V2</title>
      </Head>
      <PublicProfileOuterContainer>
        <PublicProfileLayout profile={profile} />
      </PublicProfileOuterContainer>
    </>
  ) : (
    <></>
  );
};

export default PublicProfilePage;

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        locale: 'en',
        profile: v4(),
      },
    };
  });

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
    filenames: ['common', 'me', 'country', 'donate', 'profile'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
