import type { APIError } from '@planet-sdk/common';
import type { PaymentHistory } from '../../../common/types/payments';
import type { ReactElement } from 'react';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import AccountRecord from '../../Account/components/AccountRecord';
import TransactionListLoader from '../../../../../public/assets/images/icons/TransactionListLoader';
import { Button, CircularProgress } from '@mui/material';
import NoTransactionsFound from '../components/NoTransactionsFound';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../../hooks/useApi';
import {
  useAuthStore,
  useErrorHandlingStore,
  usePlanetCashStore,
} from '../../../../stores';
import { useRouter } from 'next/router';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';

interface TransactionsProps {
  setProgress?: (progress: number) => void;
}

const Transactions = ({
  setProgress,
}: TransactionsProps): ReactElement | null => {
  const t = useTranslations('Me');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { getApiAuthenticated } = useApi();
  // local state
  const [transactionHistory, setTransactionHistory] =
    useState<PaymentHistory | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // store: state
  const hasPlanetCashAccount = usePlanetCashStore(
    (state) =>
      state.planetCashAccounts !== null && state.planetCashAccounts.length > 0
  );
  const isAuthReady = useAuthStore(
    (state) => state.token !== null && state.isAuthResolved
  );
  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const handleRecordToggle = (index: number | undefined): void => {
    if (selectedRecord === index || index === undefined) {
      setSelectedRecord(null);
      setIsModalOpen(false);
    } else {
      setSelectedRecord(index);
      setIsModalOpen(true);
    }
  };

  const fetchTransactions = useCallback(
    async (next = false) => {
      try {
        setIsDataLoading(true);
        setProgress && setProgress(70);

        const queryParams: Record<string, string> = {
          filter: 'planet-cash',
          limit: '15',
        };

        if (transactionHistory?._links?.next && next) {
          const nextUrl = new URL(
            transactionHistory?._links?.next,
            window.location.origin
          );

          const page = nextUrl.searchParams.get('page');
          if (page) queryParams.page = page;
        }
        const newTransactionHistory = await getApiAuthenticated<PaymentHistory>(
          `/app/paymentHistory`,
          { queryParams }
        );

        if (transactionHistory) {
          setTransactionHistory({
            ...transactionHistory,
            items: [
              ...transactionHistory.items,
              ...newTransactionHistory.items,
            ],
            _links: newTransactionHistory._links,
          });
        } else {
          setTransactionHistory(newTransactionHistory);
        }
      } catch (err) {
        setErrors(handleError(err as APIError));
        router.push(localizedPath('/profile/planetcash'));
      }
      setIsDataLoading(false);
      if (setProgress) {
        setProgress(100);
        setTimeout(() => setProgress(0), 1000);
      }
    },
    [transactionHistory]
  );

  useEffect(() => {
    if (isAuthReady && hasPlanetCashAccount) fetchTransactions();
  }, [isAuthReady, hasPlanetCashAccount]);

  useEffect(() => {
    // Cleanup function to reset state and address Warning: Can't perform a React state update on an unmounted component.
    return () => {
      setSelectedRecord(null);
      setIsDataLoading(false);
      setIsModalOpen(false);
    };
  }, []);

  //Initial loading state (no data yet and request in progress)
  if (!transactionHistory && isDataLoading) {
    return (
      <>
        <TransactionListLoader />
        <TransactionListLoader />
        <TransactionListLoader />
      </>
    );
  }

  //No data available (nothing to render)
  if (!transactionHistory) {
    return null;
  }

  //Empty state (data loaded but no transactions found)
  if (transactionHistory.items.length === 0) {
    return <NoTransactionsFound />;
  }

  //Transactions available → render list, pagination, and modal
  return (
    <>
      {transactionHistory.items.map((record, index) => {
        return (
          <AccountRecord
            key={index}
            handleRecordToggle={handleRecordToggle}
            index={index}
            selectedRecord={selectedRecord}
            record={record}
            isPlanetCash={true}
          />
        );
      })}

      {transactionHistory._links.next && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => fetchTransactions(true)}
          disabled={isDataLoading}
          className="loadingButton"
        >
          {isDataLoading ? (
            <CircularProgress color="primary" size={24} />
          ) : (
            t('loadMore')
          )}
        </Button>
      )}

      {isModalOpen && selectedRecord !== null && (
        <AccountRecord
          isModal={true}
          handleRecordToggle={handleRecordToggle}
          selectedRecord={selectedRecord}
          record={transactionHistory.items[selectedRecord]}
          isPlanetCash={true}
        />
      )}
    </>
  );
};

export default Transactions;
