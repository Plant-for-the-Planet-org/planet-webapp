import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type { Tenant } from '@planet-sdk/common';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import { useTranslations } from 'next-intl';
import Head from 'next/head';

import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import DashboardView from '../../../../../src/features/common/Layout/DashboardView';
import Payments from '../../../../../src/features/user/PaymentHistory/PaymentsView';
import { useTenantStore } from '../../../../../src/stores/tenantStore';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { defaultTenant } from '../../../../../tenant.config';

interface PageProps {
  messages: AbstractIntlMessages;
  tenantConfig: Tenant;
}

function AccountPayments(): ReactElement {
  const t = useTranslations('Me');
  // store: state
  const isInitialized = useTenantStore((state) => state.isInitialized);

  // Gate rendering on tenant store init, matching every other profile page.
  if (!isInitialized) return <></>;

  return (
    <UserLayout>
      <Head>
        <title>{t('payments')}</title>
      </Head>
      <DashboardView
        title={t('payments')}
        subtitle={t('donationsSubTitle')}
        multiColumn={true}
      >
        <Payments />
      </DashboardView>
    </UserLayout>
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

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country'],
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

export default AccountPayments;
