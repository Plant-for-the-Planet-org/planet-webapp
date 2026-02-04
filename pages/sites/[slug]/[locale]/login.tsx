import type { ReactElement } from 'react';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';

import { useEffect } from 'react';
import { UserProfileLoader } from '../../../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { useRouter } from 'next/router';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';
import { defaultTenant } from '../../../../tenant.config';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import useLocalizedPath from '../../../../src/hooks/useLocalizedPath';
import { useAuthSession } from '../../../../src/hooks/useAuthSession';
import { useAuthStore, useUserStore } from '../../../../src/stores';

interface Props {
  pageProps: PageProps;
}

export default function Login({ pageProps }: Props): ReactElement {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { setTenantConfig } = useTenant();
  const { auth0Error, isAuthenticated, loginWithRedirect } = useAuthSession();
  // store: state
  const userProfile = useUserStore((state) => state.userProfile);
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  // if the user is authenticated check if we have slug, and if we do, send user to slug
  // else send user to login flow

  useEffect(() => {
    if (!isAuthResolved) return;

    // User profile exists → redirect
    if (userProfile) {
      const redirectLink = localStorage.getItem('redirectLink');

      if (redirectLink) {
        localStorage.removeItem('redirectLink');
        router.push(localizedPath(redirectLink));
      } else {
        router.push(localizedPath('/profile'));
      }
      return;
    }

    // User profile is explicitly null and auth is resolved
    // → wait for context to redirect to complete signup
    if (
      userProfile === null &&
      (isAuthenticated || auth0Error?.message === '401')
    ) {
      return;
    }

    // Not authenticated → login
    loginWithRedirect({
      redirectUri: `${window.location.origin}/login`,
      ui_locales: localStorage.getItem('language') || 'en',
    });
  }, [userProfile, isAuthResolved]);

  return pageProps.tenantConfig ? (
    <div>
      <UserProfileLoader />
    </div>
  ) : (
    <></>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths =
    subDomainPaths?.map((path) => {
      return {
        params: {
          slug: path.params.slug,
          locale: 'en',
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
    filenames: ['common'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
