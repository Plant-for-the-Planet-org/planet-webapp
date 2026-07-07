import type { Tenant } from '@planet-sdk/common';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { ReactElement } from 'react';

import { useTranslations } from 'next-intl';
import Head from 'next/head';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import TreemapperMigration from '../../../../../src/features/user/TreemapperMigration';
import DashboardView from '../../../../../src/features/common/Layout/DashboardView';
import { UserProfileLoader } from '../../../../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { useTenantStore } from '../../../../../src/stores/tenantStore';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../tenant.config';

/**
 * Next.js page for the new TreeMapper dashboard at /treemapper.
 */
function TreemapperDashboardPage(): ReactElement {
  const t = useTranslations('Me');
  const isInitialized = useTenantStore((state) => state.isInitialized);
  if (!isInitialized) return <UserProfileLoader />;

  return (
    <UserLayout>
      <Head>
        <title>{t('treemapper')}</title>
      </Head>
      <DashboardView title="" subtitle="" variant="full-width">
        <TreemapperMigration />
      </DashboardView>
    </UserLayout>
  );
}

export default TreemapperDashboardPage;

/**
 * Generates static paths for every tenant slug, locale defaulted to 'en'.
 */
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

/**
 * Loads i18n messages and the tenant config for the requested slug + locale.
 */
export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'treemapper'],
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
