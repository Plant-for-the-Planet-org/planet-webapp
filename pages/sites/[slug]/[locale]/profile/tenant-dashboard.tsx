import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { Tenant } from '@planet-sdk/common';

import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../tenant.config';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import TenantDashboard from '../../../../../src/features/user/TenantDashboard';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import { useTranslations } from 'next-intl';
import Head from 'next/head';
import DashboardView from '../../../../../src/features/common/Layout/DashboardView';

const TenantDashboardPage = () => {
  const t = useTranslations('Profile.tenant');
  return (
    <UserLayout>
      <Head>
        <title>{t('tenantReport')}</title>
      </Head>
      <DashboardView
        title={t('tenantReport')}
        subtitle={null}
        multiColumn={true}
      >
        <TenantDashboard />
      </DashboardView>
    </UserLayout>
  );
};

export default TenantDashboardPage;

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
    filenames: ['profile', 'common', 'me', 'country'],
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
