import React, { ReactElement } from 'react';
import UserProfileLoader from '../../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { useRouter } from 'next/router';
import { useUserProps } from '../../../src/features/common/Layout/UserPropsContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useTenant } from '../../../src/features/common/Layout/TenantContext';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
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
          router.push('/t/[id]', `/t/${user.slug}`, { shallow: true });
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
          redirectUri: `${process.env.NEXTAUTH_URL}/login`,
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

export async function getStaticPaths() {
  return {
    paths: await constructPathsForTenantSlug(),
    fallback: 'blocking',
  };
}

export async function getStaticProps(props: any) {
  const tenantConfig = await getTenantConfig(props.params.slug);
  return {
    props: {
      ...(await serverSideTranslations(
        props.locale || 'en',
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
}
