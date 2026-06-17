import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common';

import Head from 'next/head';
import { useEffect } from 'react';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Analytics from '../../../../../../src/features/user/TreeMapper/Analytics';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import useLocalizedPath from '../../../../../../src/hooks/useLocalizedPath';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useUserStore, useTenantStore } from '../../../../../../src/stores';
import { defaultTenant } from '../../../../../../tenant.config';

function TreeMapperAnalytics(): ReactElement {
  const t = useTranslations('TreemapperAnalytics');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  // store: state
  const userProfile = useUserStore((state) => state.userProfile);
  const isInitialized = useTenantStore((state) => state.isInitialized);

  useEffect(() => {
    if (!userProfile) return;

    const isTpoWithAnalyticsEnabled =
      process.env.ENABLE_ANALYTICS && userProfile.type === 'tpo';

    if (!isTpoWithAnalyticsEnabled) {
      router.push(localizedPath('/profile'));
    }
  }, [userProfile]);

  if (!isInitialized) return <></>;

  return (
    <UserLayout>
      <Head>
        <title> {t('title')} </title>
      </Head>
      <Analytics />
    </UserLayout>
  );
}

export default TreeMapperAnalytics;

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
    filenames: ['common', 'me', 'country', 'treemapperAnalytics'],
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
