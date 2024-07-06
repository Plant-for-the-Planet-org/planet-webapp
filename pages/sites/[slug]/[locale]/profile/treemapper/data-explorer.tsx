import Head from 'next/head';
import React, { ReactElement, useEffect } from 'react';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Analytics from '../../../../../../src/features/user/TreeMapper/Analytics';
import { AbstractIntlMessages, useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useUserProps } from '../../../../../../src/features/common/Layout/UserPropsContext';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { defaultTenant } from '../../../../../../tenant.config';
import { useTenant } from '../../../../../../src/features/common/Layout/TenantContext';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';

interface Props {
  pageProps: PageProps;
}

function TreeMapperAnalytics({
  pageProps: { tenantConfig },
}: Props): ReactElement {
  const t = useTranslations('TreemapperAnalytics');

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
        router.push('/profile');
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

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
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
    filenames: ['common', 'me', 'country', 'treemapperAnalytics'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
