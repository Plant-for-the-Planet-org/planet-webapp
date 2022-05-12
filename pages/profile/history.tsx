import React, { ReactElement } from 'react';
import i18next from '../../i18n';
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';
import TopProgressBar from '../../src/features/common/ContentLoaders/TopProgressBar';
import History from '../../src/features/user/Account/History';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ErrorHandlingContext } from '../../src/features/common/Layout/ErrorHandlingContext';

const { useTranslation } = i18next;

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
          paymentHistory._links.next,
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
  const router = useRouter();

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
