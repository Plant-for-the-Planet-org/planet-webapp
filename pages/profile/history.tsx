import React, { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';
import TopProgressBar from '../../src/features/common/ContentLoaders/TopProgressBar';
import History from '../../src/features/user/Account/History';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { ErrorHandlingContext } from '../../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
interface Props {}

function AccountHistory({}: Props): ReactElement {
  const { t } = useTranslation(['me']);
  const { token, contextLoaded } = React.useContext(UserPropsContext);

  const [progress, setProgress] = React.useState(0);
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [filter, setFilter] = React.useState<string | null>(null);
  const [paymentHistory, setpaymentHistory] =
    React.useState<Payments.PaymentHistory | null>(null);
  const [accountingFilters, setaccountingFilters] =
    React.useState<Payments.Filters | null>(null);

  const { handleError } = React.useContext(ErrorHandlingContext);

  async function fetchPaymentHistory(next = false): Promise<void> {
    setIsDataLoading(true);
    setProgress(70);
    if (next && paymentHistory?._links?.next) {
      const newPaymentHistory: Payments.PaymentHistory =
        await getAuthenticatedRequest(
          `${
            filter && accountingFilters
              ? accountingFilters[filter] +
                '&' +
                paymentHistory?._links?.next.split('?').pop()
              : paymentHistory?._links?.next
          }`,
          token,
          {},
          handleError,
          '/profile'
        );
      setpaymentHistory({
        ...paymentHistory,
        items: [...paymentHistory.items, ...newPaymentHistory.items],
        _links: newPaymentHistory._links,
      });
      setProgress(100);
      setIsDataLoading(false);
      setTimeout(() => setProgress(0), 1000);
    } else {
      if (filter === null) {
        const paymentHistory: Payments.PaymentHistory =
          await getAuthenticatedRequest(
            '/app/paymentHistory?limit=15',
            token,
            {},
            handleError,
            '/profile'
          );
        setpaymentHistory(paymentHistory);
        setProgress(100);
        setIsDataLoading(false);
        setTimeout(() => setProgress(0), 1000);
        setaccountingFilters(paymentHistory._filters);
      } else {
        const paymentHistory = await getAuthenticatedRequest(
          `${
            filter && accountingFilters
              ? accountingFilters[filter] + '&limit=15'
              : '/app/paymentHistory?limit=15'
          }`,
          token,
          {},
          handleError,
          '/profile'
        );
        setpaymentHistory(paymentHistory);
        setProgress(100);
        setIsDataLoading(false);
        setTimeout(() => setProgress(0), 1000);
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

  return (
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
        <History {...HistoryProps} />
        {/* <UnderMaintenance/> */}
      </UserLayout>
    </>
  );
}

export default AccountHistory;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
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
    },
  };
}
