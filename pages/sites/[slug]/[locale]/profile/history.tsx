import React, { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import { getAuthenticatedRequest } from '../../../../../src/utils/apiRequests/api';
import TopProgressBar from '../../../../../src/features/common/ContentLoaders/TopProgressBar';
import History from '../../../../../src/features/user/Account/History';
import { useUserProps } from '../../../../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { ErrorHandlingContext } from '../../../../../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { handleError, APIError } from '@planet-sdk/common';
import {
  Filters,
  PaymentHistory,
} from '../../../../../src/features/common/types/payments';
import DashboardView from '../../../../../src/features/common/Layout/DashboardView';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../tenant.config';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
}

function AccountHistory({ pageProps }: Props): ReactElement {
  const { t } = useTranslation(['me']);
  const { token, contextLoaded, logoutUser } = useUserProps();
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  const [progress, setProgress] = React.useState(0);
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [filter, setFilter] = React.useState<string | null>(null);
  const [paymentHistory, setpaymentHistory] =
    React.useState<PaymentHistory | null>(null);
  const [accountingFilters, setaccountingFilters] =
    React.useState<Filters | null>(null);

  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);

  const { tenantConfig } = pageProps;

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  async function fetchPaymentHistory(next = false): Promise<void> {
    setIsDataLoading(true);
    setProgress(70);
    if (next && paymentHistory?._links?.next) {
      try {
        const newPaymentHistory = await getAuthenticatedRequest<PaymentHistory>(
          tenantConfig?.id,
          `${
            filter && accountingFilters
              ? accountingFilters[filter] +
                '&' +
                paymentHistory?._links?.next.split('?').pop()
              : paymentHistory?._links?.next
          }`,
          token,
          logoutUser
        );
        setpaymentHistory({
          ...paymentHistory,
          items: [...paymentHistory.items, ...newPaymentHistory.items],
          _links: newPaymentHistory._links,
        });
        setProgress(100);
        setIsDataLoading(false);
        setTimeout(() => setProgress(0), 1000);
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/profile');
      }
    } else {
      if (filter === null) {
        try {
          const paymentHistory = await getAuthenticatedRequest<PaymentHistory>(
            tenantConfig?.id,
            '/app/paymentHistory?limit=15',
            token,
            logoutUser
          );
          setpaymentHistory(paymentHistory);
          setProgress(100);
          setIsDataLoading(false);
          setTimeout(() => setProgress(0), 1000);
          setaccountingFilters(paymentHistory._filters);
        } catch (err) {
          setErrors(handleError(err as APIError));
          redirect('/profile');
        }
      } else {
        try {
          const paymentHistory = await getAuthenticatedRequest<PaymentHistory>(
            tenantConfig?.id,
            `${
              filter && accountingFilters
                ? accountingFilters[filter] + '&limit=15'
                : '/app/paymentHistory?limit=15'
            }`,
            token,
            logoutUser
          );
          setpaymentHistory(paymentHistory);
          setProgress(100);
          setIsDataLoading(false);
          setTimeout(() => setProgress(0), 1000);
        } catch (err) {
          setErrors(handleError(err as APIError));
          redirect('/profile');
        }
      }
    }
  }

  React.useEffect(() => {
    if (contextLoaded && token) fetchPaymentHistory();
  }, [filter, contextLoaded, token]);

  const HistoryProps = {
    filter,
    setFilter,
    isDataLoading,
    accountingFilters,
    paymentHistory,
    fetchPaymentHistory,
  };

  // // TODO - remove this
  // if (typeof window !== 'undefined') {
  //   router.push('/');
  // }

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
          title={t('me:payments')}
          subtitle={t('me:donationsSubTitle')}
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
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
      tenantConfig,
    },
  };
};
