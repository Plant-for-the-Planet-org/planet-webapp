import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common';
import type { AbstractIntlMessages } from 'next-intl';

import Head from 'next/head';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../../tenant.config';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useTenant } from '../../../../../../src/features/common/Layout/TenantContext';
import DonationReceiptAuthenticated from "../../../../../../src/features/user/DonationReceipt/DonationReceiptAuthenticated";

export default function DonationReceiptPage({ pageProps }: Props) {
    const { setTenantConfig } = useTenant();

    // Ensure tenant config is set based on the pageProps
    setTenantConfig(pageProps.tenantConfig);

  return (
    <UserLayout>
      <Head>
        {/*<title>{t('receipts')}</title>*/}
        <title>Receipts</title>
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

interface Props {
    pageProps: PageProps;
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'donationReceipt'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
