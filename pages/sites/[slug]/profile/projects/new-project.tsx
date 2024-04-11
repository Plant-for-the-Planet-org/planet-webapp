import { useTranslation } from 'next-i18next';
import React, { ReactElement } from 'react';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import ManageProjects from '../../../../../src/features/user/ManageProjects';
import { useUserProps } from '../../../../../src/features/common/Layout/UserPropsContext';
import AccessDeniedLoader from '../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../../../../src/features/common/Layout/Footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { defaultTenant } from '../../../../../tenant.config';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
}

export default function AddProjectType({
  pageProps: { tenantConfig },
}: Props): ReactElement {
  const { t } = useTranslation(['donate', 'manageProjects']);
  const [accessDenied, setAccessDenied] = React.useState<boolean>(false);
  const [setupAccess, setSetupAccess] = React.useState<boolean>(false);
  const { user, contextLoaded, token, loginWithRedirect } = useUserProps();
  const router = useRouter();
  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  React.useEffect(() => {
    async function loadUserData() {
      const usertype = user?.type;
      if (usertype === 'tpo') {
        setAccessDenied(false);
        setSetupAccess(true);
      } else {
        setAccessDenied(true);
        setSetupAccess(true);
      }
    }

    if (contextLoaded) {
      if (token && user) {
        loadUserData();
      } else {
        localStorage.setItem(
          'redirectLink',
          '/profile/projects/add-project/restoration-project'
        );
        loginWithRedirect({
          redirectUri: `${window.location.origin}/login`,
          ui_locales: localStorage.getItem('language') || 'en',
        });
      }
    }
  }, [contextLoaded]);

  // User is not TPO
  if (tenantConfig && accessDenied && setupAccess) {
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
        <title>{t('manageProjects:addNewProject')}</title>
      </Head>

      {user?.type === 'tpo' && token !== null ? (
        <ManageProjects token={token} />
      ) : (
        <AccessDeniedLoader />
      )}
    </UserLayout>
  ) : (
    <></>
  );
}

export async function getStaticPaths() {
  const paths = await constructPathsForTenantSlug();
  return {
    paths: paths,
    fallback: 'blocking',
  };
}

interface StaticProps {
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<StaticProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<StaticProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale || 'en',
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
};
