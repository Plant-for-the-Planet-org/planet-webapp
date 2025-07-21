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
import React, { useEffect } from 'react';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Analytics from '../../../../../../src/features/user/TreeMapper/Analytics';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useUserProps } from '../../../../../../src/features/common/Layout/UserPropsContext';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../../tenant.config';
import { useTenant } from '../../../../../../src/features/common/Layout/TenantContext';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import getLocalizedPath from '../../../../../../src/utils/getLocalizedPath';

interface Props {
  pageProps: PageProps;
}

function TreeMapperAnalytics({
  pageProps: { tenantConfig },
}: Props): ReactElement {
  const t = useTranslations('TreemapperAnalytics');
  const locale = useLocale();
  const { user } = useUserProps();
  const router = useRouter();
  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (user) {
      if (!(process.env.ENABLE_ANALYTICS && user.type === 'tpo')) {
        router.push(getLocalizedPath('/profile', locale));
      }
    }
  }, [user]);

  return tenantConfig ? (
    <>
      <UserLayout>
        <Head>
          <title> {t('title')} </title>
        </Head>
        <Analytics />
      </UserLayout>
    </>
  ) : (
    <></>
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
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'treemapperAnalytics'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
