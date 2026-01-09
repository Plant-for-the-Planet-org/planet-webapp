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
import { useUserProps } from '../../../../src/features/common/Layout/UserPropsContext';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import useLocalizedPath from '../../../../src/hooks/useLocalizedPath';
import { useTenantStore } from '../../../../src/stores/tenantStore';

interface Props {
  pageProps: PageProps;
}

export default function Login({ pageProps }: Props): ReactElement {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  // store: action
  const setTenantConfig = useTenantStore((state) => state.setTenantConfig);

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  // if the user is authenticated check if we have slug, and if we do, send user to slug
  // else send user to login flow

  const {
    user,
    contextLoaded,
    loginWithRedirect,
    isAuthenticated,
    auth0Error,
  } = useUserProps();

  useEffect(() => {
    async function loadFunction() {
      // redirect
      if (user) {
        if (localStorage.getItem('redirectLink')) {
          const redirectLink = localStorage.getItem('redirectLink');
          if (redirectLink) {
            localStorage.removeItem('redirectLink');
            router.push(localizedPath(redirectLink));
          }
        } else {
          router.push(localizedPath('/profile'));
        }
      }
    }
    if (contextLoaded) {
      if (user) {
        loadFunction();
      } else if (
        user === null &&
        (isAuthenticated || auth0Error?.message === '401')
      ) {
        // wait for context to redirect to complete signup
      } else {
        loginWithRedirect({
          redirectUri: `${window.location.origin}/login`,
          ui_locales: localStorage.getItem('language') || 'en',
        });
      }
    }
  }, [user, contextLoaded]);

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
