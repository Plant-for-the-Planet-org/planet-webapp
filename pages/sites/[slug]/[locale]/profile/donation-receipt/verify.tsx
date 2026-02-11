import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { Tenant } from '@planet-sdk/common';

import Head from 'next/head';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import DonationReceiptAuthenticated from '../../../../../../src/features/user/DonationReceipt/DonationReceiptAuthenticated';
import { useTranslations } from 'next-intl';
import { defaultTenant } from '../../../../../../tenant.config';
import { useTenantStore } from '../../../../../../src/stores/tenantStore';

export default function DonationReceiptPage() {
  const tReceipt = useTranslations('DonationReceipt');

  //store: state
  const isInitialized = useTenantStore((state) => state.isInitialized);
  if (!isInitialized) return <></>;

  return (
    <UserLayout>
      <Head>
        <title>{tReceipt('receipts')}</title>
      </Head>
      <DonationReceiptAuthenticated />
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

interface PageProps {
  messages: AbstractIntlMessages;
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'donationReceipt'],
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
