import { ReactElement, useContext, useState, useEffect } from 'react';
import i18next from '../../../../../i18n';
import AccountRecord from '../../Account/components/AccountRecord';
import TransactionListLoader from '../../../../../public/assets/images/icons/TransactionListLoader';
import { Button, CircularProgress } from '@mui/material';

import { getAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import NoTransactionsFound from '../components/NoTransactionsFound';

const { useTranslation } = i18next;

interface TransactionsProps {
  setProgress?: (progress: number) => void;
}

const Transactions = ({
  setProgress,
}: TransactionsProps): ReactElement | null => {
  const { t } = useTranslation('me');
  const { token, contextLoaded } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);
  const [transactionHistory, setTransactionHistory] =
    useState<Payments.PaymentHistory | null>(null);
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

  const fetchTransactions = async (next = false) => {
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

    const newTransactionHistory: Payments.PaymentHistory =
      await getAuthenticatedRequest(
        apiUrl,
        token,
        {},
        handleError,
        '/profile/planetcash'
      );

    if (transactionHistory) {
      setTransactionHistory({
        ...transactionHistory,
        items: [...transactionHistory.items, ...newTransactionHistory.items],
        _links: newTransactionHistory._links,
      });
    } else {
      setTransactionHistory(newTransactionHistory);
    }

    setIsDataLoading(false);
    if (setProgress) {
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  useEffect(() => {
    if (contextLoaded && token) fetchTransactions();
  }, [contextLoaded, token]);

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
