import type { APIError } from '@planet-sdk/common';
import type { PaymentHistory } from '../../../common/types/payments';
import type { ReactElement } from 'react';
import { useContext, useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import AccountRecord from '../../Account/components/AccountRecord';
import TransactionListLoader from '../../../../../public/assets/images/icons/TransactionListLoader';
import { Button, CircularProgress } from '@mui/material';
import { usePlanetCash } from '../../../common/Layout/PlanetCashContext';
import { getAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import NoTransactionsFound from '../components/NoTransactionsFound';
import { handleError } from '@planet-sdk/common';
import { useTenant } from '../../../common/Layout/TenantContext';

interface TransactionsProps {
  setProgress?: (progress: number) => void;
}

const Transactions = ({
  setProgress,
}: TransactionsProps): ReactElement | null => {
  const t = useTranslations('Me');
  const { token, contextLoaded, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { redirect, setErrors } = useContext(ErrorHandlingContext);
  const { accounts } = usePlanetCash();
  const [transactionHistory, setTransactionHistory] =
    useState<PaymentHistory | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        const nextPage =
          next && transactionHistory?._links?.next
            ? transactionHistory._links.next.split('?').pop()
            : undefined;

        const apiUrl =
          next && transactionHistory?._links?.next
            ? `/app/paymentHistory?filter=planet-cash&limit=15&${nextPage}`
            : `/app/paymentHistory?filter=planet-cash&limit=15`;

        const newTransactionHistory =
          await getAuthenticatedRequest<PaymentHistory>(
            tenantConfig?.id,
            apiUrl,
            token,
            logoutUser
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
        redirect('/profile/planetcash');
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
    if (contextLoaded && token && accounts && accounts.length > 0)
      fetchTransactions();
  }, [contextLoaded, token, accounts]);

  useEffect(() => {
    // Cleanup function to reset state and address Warning: Can't perform a React state update on an unmounted component.
    return () => {
      setSelectedRecord(null);
      setIsDataLoading(false);
      setIsModalOpen(false);
    };
  }, []);

  return !transactionHistory && isDataLoading ? (
    <>
      <TransactionListLoader />
      <TransactionListLoader />
      <TransactionListLoader />
    </>
  ) : transactionHistory && transactionHistory.items.length > 0 ? (
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
  ) : (
    transactionHistory && <NoTransactionsFound />
  );
};

export default Transactions;
