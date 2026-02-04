import type { AbstractIntlMessages } from 'next-intl';
import type { ReactElement } from 'react';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import ManageProjects from '../../../../../../src/features/user/ManageProjects';
import AccessDeniedLoader from '../../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../../../../../src/features/common/Layout/Footer';
import Head from 'next/head';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../../tenant.config';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../../src/features/common/Layout/TenantContext';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useAuthStore, useUserStore } from '../../../../../../src/stores';
import { useAuthSession } from '../../../../../../src/hooks/useAuthSession';

interface Props {
  pageProps: PageProps;
}

export default function AddProjectType({
  pageProps: { tenantConfig },
}: Props): ReactElement {
  const t = useTranslations('ManageProjects');
  const { loginWithRedirect } = useAuthSession();
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  // local state
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  //store: state
  const token = useAuthStore((state) => state.token);
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);
  const userProfile = useUserStore((state) => state.userProfile);

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (!isAuthResolved) return;

    // Auth resolved but missing token or profile → redirect to login
    if (!token || !userProfile) {
      localStorage.setItem(
        'redirectLink',
        '/profile/projects/add-project/restoration-project'
      );

      loginWithRedirect({
        redirectUri: `${window.location.origin}/login`,
        ui_locales: localStorage.getItem('language') || 'en',
      });
      return;
    }

    // Auth resolved and user profile exists
    const isTPO = userProfile.type === 'tpo';
    setAccessDenied(!isTPO);
  }, [isAuthResolved]);

  // User is not TPO
  if (tenantConfig && accessDenied) {
    return (
      <>
        <AccessDeniedLoader />
        <Footer />
      </>
    );
  }

  return tenantConfig ? (
    <UserLayout>
      <Head>
        <title>{t('addNewProject')}</title>
      </Head>

      {userProfile?.type === 'tpo' && token !== null ? (
        <ManageProjects token={token} />
      ) : (
        <AccessDeniedLoader />
      )}
    </UserLayout>
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
    filenames: ['common', 'maps', 'me', 'country', 'manageProjects'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
