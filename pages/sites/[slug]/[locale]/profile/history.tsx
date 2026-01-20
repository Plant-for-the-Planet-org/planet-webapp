import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type { APIError } from '@planet-sdk/common';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type {
  Filters,
  PaymentHistory,
} from '../../../../../src/features/common/types/payments';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import { useEffect, useState, useContext } from 'react';
import { useTranslations } from 'next-intl';
import TopProgressBar from '../../../../../src/features/common/ContentLoaders/TopProgressBar';
import History from '../../../../../src/features/user/Account/History';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { ErrorHandlingContext } from '../../../../../src/features/common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import DashboardView from '../../../../../src/features/common/Layout/DashboardView';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../tenant.config';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { useApi } from '../../../../../src/hooks/useApi';
import { useAuthStore } from '../../../../../src/stores';

interface Props {
  pageProps: PageProps;
}

function AccountHistory({ pageProps }: Props): ReactElement {
  const t = useTranslations('Me');
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  const { getApiAuthenticated } = useApi();
  const { redirect, setErrors } = useContext(ErrorHandlingContext);
  const { tenantConfig } = pageProps;
  // local state
  const [progress, setProgress] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory | null>(
    null
  );
  const [accountingFilters, setAccountingFilters] = useState<Filters | null>(
    null
  );
  //store: state
  const isAuthReady = useAuthStore(
    (state) => state.token !== null && state.isAuthResolved
  );

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  async function fetchPaymentHistory(next = false): Promise<void> {
    setIsDataLoading(true);
    setProgress(70);

    try {
      if (next && paymentHistory?._links?.next) {
        // Parse the next URL to extract query parameters
        const nextUrl = new URL(
          paymentHistory?._links?.next,
          window.location.origin
        );
        const path = nextUrl.pathname;
        // Extract query parameters from the URL
        const queryParams: Record<string, string> = {};
        nextUrl.searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });
        // If filter is selected, add it to query params
        if (filter !== null) queryParams.filter = filter;

        const newPaymentHistory = await getApiAuthenticated<PaymentHistory>(
          path,
          { queryParams }
        );
        setPaymentHistory({
          ...paymentHistory,
          items: [...paymentHistory.items, ...newPaymentHistory.items],
          _links: newPaymentHistory._links,
        });
      } else {
        const queryParams: Record<string, string> = {
          limit: '15',
        };

        // If filter is selected, add it to query params
        if (filter !== null) queryParams.filter = filter;
        const paymentHistory = await getApiAuthenticated<PaymentHistory>(
          '/app/paymentHistory',
          {
            queryParams,
          }
        );
        setPaymentHistory(paymentHistory);
        setAccountingFilters(paymentHistory._filters);
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
      redirect('/profile');
    }
    setProgress(100);
    setTimeout(() => {
      setProgress(0);
      setIsDataLoading(false);
    }, 1000);
  }

  useEffect(() => {
    if (isAuthReady) fetchPaymentHistory();
  }, [filter, isAuthReady]);

  const HistoryProps = {
    filter,
    setFilter,
    isDataLoading,
    accountingFilters,
    paymentHistory,
    fetchPaymentHistory,
  };

  return tenantConfig ? (
    <>
      {progress > 0 && (
        <div className={'topLoader'}>
          <TopProgressBar progress={progress} />
        </div>
      )}
      <UserLayout>
        <Head>
          <title>{t('history')}</title>
        </Head>
        <DashboardView
          title={t('payments')}
          subtitle={t('donationsSubTitle')}
          multiColumn={true}
        >
          <History {...HistoryProps} />
        </DashboardView>

        {/* <UnderMaintenance/> */}
      </UserLayout>
    </>
  ) : (
    <></>
  );
}

export default AccountHistory;

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
    filenames: ['common', 'me', 'country'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
