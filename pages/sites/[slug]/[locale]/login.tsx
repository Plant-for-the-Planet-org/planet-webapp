import React, { ReactElement } from 'react';
import { UserProfileLoader } from '../../../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { useRouter } from 'next/router';
import { useUserProps } from '../../../../src/features/common/Layout/UserPropsContext';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { defaultTenant } from '../../../../tenant.config';
import { AbstractIntlMessages } from 'next-intl';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';

interface Props {
  pageProps: PageProps;
}

export default function Login({ pageProps }: Props): ReactElement {
  const router = useRouter();
  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
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

  React.useEffect(() => {
    async function loadFunction() {
      // redirect
      if (user) {
        if (localStorage.getItem('redirectLink')) {
          const redirectLink = localStorage.getItem('redirectLink');
          if (redirectLink) {
            localStorage.removeItem('redirectLink');
            router.push(redirectLink);
          }
        } else {
          router.push('/profile');
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

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths?.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        locale: 'en',
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
    filenames: ['common'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
