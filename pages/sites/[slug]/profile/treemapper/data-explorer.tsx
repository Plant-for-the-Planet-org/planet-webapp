import Head from 'next/head';
import React, { ReactElement, useEffect } from 'react';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Analytics from '../../../../../src/features/user/TreeMapper/Analytics';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useUserProps } from '../../../../../src/features/common/Layout/UserPropsContext';
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
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
}

function TreeMapperAnalytics({
  pageProps: { tenantConfig },
}: Props): ReactElement {
  const { t, ready } = useTranslation('treemapperAnalytics');

  const { user } = useUserProps();
  const { push, isReady } = useRouter();
  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
    if (isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [isReady]);

  useEffect(() => {
    if (user) {
      if (!(process.env.ENABLE_ANALYTICS && user.type === 'tpo')) {
        push('/profile');
      }
    }
  }, [user]);

  return tenantConfig ? (
    <>
      <UserLayout>
        <Head>
          <title> {ready ? t('treemapperAnalytics:title') : ''} </title>
        </Head>
        <Analytics />
      </UserLayout>
    </>
  ) : (
    <></>
  );
}

export default TreeMapperAnalytics;

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
        ['common', 'me', 'country', 'treemapperAnalytics'],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
      tenantConfig,
    },
  };
};
