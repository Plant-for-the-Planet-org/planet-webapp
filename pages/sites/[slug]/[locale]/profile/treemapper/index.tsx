import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import Head from 'next/head';
import React, { useMemo } from 'react';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import TreeMapper from '../../../../../../src/features/user/TreeMapper';
import { useTranslations } from 'next-intl';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../../tenant.config';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../../src/features/common/Layout/TenantContext';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useUserProps } from '../../../../../../src/features/common/Layout/UserPropsContext';
import FeatureMigrated from '../../../../../../src/features/user/TreeMapper/FeatureMigrated';
import DashboardPromoBanner from '../../../../../../src/features/user/TreeMapper/DashboardPromoBanner';

interface Props {
  pageProps: PageProps;
}

function TreeMapperPage({ pageProps: { tenantConfig } }: Props): ReactElement {
  const t = useTranslations('Me');
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  const { user } = useUserProps();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  const pageContent = useMemo(() => {
    if (!user) return null;

    const { treemapperMigrationState } = user;

    const isBlockedByMigration =
      treemapperMigrationState === 'completed' ||
      treemapperMigrationState === 'in-progress';

    if (isBlockedByMigration) {
      return (
        <FeatureMigrated
          status={treemapperMigrationState}
          featureKey="data-explorer"
        />
      );
    }

    const showPromoBanner =
      user.type === 'tpo' &&
      !isBlockedByMigration &&
      process.env.NEXT_PUBLIC_SHOW_DASHBOARD_PROMO === 'true';

    return (
      <>
        {showPromoBanner && <DashboardPromoBanner />}
        <TreeMapper />
      </>
    );
  }, [user]);

  return tenantConfig ? (
    <UserLayout>
      <Head>
        <title>{t('treemapper')}</title>
      </Head>
      {pageContent}
    </UserLayout>
  ) : (
    <></>
  );
}

export default TreeMapperPage;

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
    filenames: ['common', 'me', 'country', 'treemapper', 'maps'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
