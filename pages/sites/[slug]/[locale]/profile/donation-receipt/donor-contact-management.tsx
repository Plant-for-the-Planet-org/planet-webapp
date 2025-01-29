import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { Tenant } from '@planet-sdk/common';

import Head from 'next/head';
import { useTranslations } from 'next-intl';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import DonorContactManagement from '../../../../../../src/features/user/DonorReceipt/DonorContactManagement';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../../tenant.config';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useDonorReceipt } from '../../../../../../src/features/common/Layout/DonorReceiptContext';
import AccessDeniedLoader from '../../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';

export default function ModifyDonorData() {
  const t = useTranslations('Donate.donationReceipt');
  const { donorReceiptData } = useDonorReceipt();
  return (
    <UserLayout>
      <Head>{t('donorContactManagement')}</Head>
      {donorReceiptData ? <DonorContactManagement /> : <AccessDeniedLoader />}
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
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'donate'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
