import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { defaultTenant } from '../../../../tenant.config';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';
import DonationReceiptLayout from '../../../../src/features/user/DonationReceipt/DonationReceiptLayout';

interface PageProps {
  messages: AbstractIntlMessages;
  tenantConfig: Tenant;
}

interface Props {
  pageProps: PageProps;
}

export default function DonationReceipt({
  pageProps: { tenantConfig },
}: Props) {
  const router = useRouter();
  const { setTenantConfig } = useTenant();

  useEffect(() => {
    if (router.isReady) setTenantConfig(tenantConfig);
  }, [router.isReady]);

  return <DonationReceiptLayout />;
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
