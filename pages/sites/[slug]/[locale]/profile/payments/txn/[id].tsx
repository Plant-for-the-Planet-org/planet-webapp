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
import { v4 } from 'uuid';

import { PaymentTransactionDetail } from '../../../../../../../src/features/user/PaymentHistory/components/PaymentTransactionDetail';
import {
  getPaymentsLayout,
  type NextPageWithPaymentsLayout,
} from '../../../../../../../src/features/user/PaymentHistory/PaymentsLayout';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../../../src/utils/language/getMessagesForPage';
import { defaultTenant } from '../../../../../../../tenant.config';

const AccountPaymentTransaction: NextPageWithPaymentsLayout =
  (): ReactElement => {
    const t = useTranslations('Me');

    return (
      <>
        <Head>
          <title>{t('payments')}</title>
        </Head>
        <PaymentTransactionDetail />
      </>
    );
  };

AccountPaymentTransaction.getLayout = getPaymentsLayout;

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  // The transaction id is unknowable at build time; render on demand and read
  // the id from the route on the client. A placeholder keeps the shape valid.
  const paths =
    subDomainPaths?.map((path) => {
      return {
        params: {
          slug: path.params.slug,
          id: v4(),
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

export default AccountPaymentTransaction;
