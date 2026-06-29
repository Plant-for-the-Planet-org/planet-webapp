import type { ReactElement } from 'react';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { Tenant } from '@planet-sdk/common';

import { defaultTenant } from '../../../../tenant.config';
import { useEffect } from 'react';
import { UserProfileLoader } from '../../../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { useRouter } from 'next/router';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import useLocalizedPath from '../../../../src/hooks/useLocalizedPath';
import { useAuthSession } from '../../../../src/hooks/useAuthSession';
import {
  useAuthStore,
  useUserStore,
  useTenantStore,
} from '../../../../src/stores';

export default function Login(): ReactElement {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { auth0Error, isAuthenticated, loginWithRedirect } = useAuthSession();
  // store: state
  const userProfile = useUserStore((state) => state.userProfile);
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);
  const isInitialized = useTenantStore((state) => state.isInitialized);

  // if the user is authenticated check if we have slug, and if we do, send user to slug
  // else send user to login flow
  useEffect(() => {
    if (!isInitialized || !isAuthResolved) return;

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
      (isAuthenticated ||
        // TODO: Remove '401' case after July 31, 2026. Confirm whether safe to remove before then.
        auth0Error?.message === '401' ||
        auth0Error?.message === 'email_not_verified')
    ) {
      // Wait for
      // Navbar to handle redirect to /verify-email OR
      // UserPropsContext to handle redirect to /complete-signup (via 303)
    }

    // Not authenticated → login
    loginWithRedirect({
      redirectUri: `${window.location.origin}/login`,
      ui_locales: localStorage.getItem('language') || 'en',
    });
  }, [userProfile, isAuthResolved, isInitialized]);

  if (!isInitialized) return <></>;

  return (
    <div>
      <UserProfileLoader />
    </div>
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
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common'],
  });

  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
