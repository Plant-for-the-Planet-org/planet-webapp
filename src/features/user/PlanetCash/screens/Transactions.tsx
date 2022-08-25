import { ReactElement, useContext, useState, useEffect } from 'react';

import AccountRecord from '../../Account/components/AccountRecord';
import TransactionListLoader from '../../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../../public/assets/images/icons/TransactionsNotFound';

import { getAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';

interface TransactionsProps {
  setProgress?: (progress: number) => void;
}

const Transactions = ({
  setProgress,
}: TransactionsProps): ReactElement | null => {
  const { token, contextLoaded } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);
  const [transactionList, setTransactionList] =
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

  const fetchTransactions = async () => {
    setIsDataLoading(true);
    setProgress && setProgress(70);

    const transactions: Payments.PaymentHistory = await getAuthenticatedRequest(
      `/app/paymentHistory?filter=planet-cash&limit=15`,
      token,
      {},
      handleError,
      '/profile/planetcash'
    );

    setTransactionList(transactions);
    setIsDataLoading(false);
    if (setProgress) {
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  useEffect(() => {
    if (contextLoaded && token) fetchTransactions();
  }, [contextLoaded, token]);

  return !transactionList && isDataLoading ? (
    <>
      <TransactionListLoader />
      <TransactionListLoader />
      <TransactionListLoader />
    </>
  ) : transactionList && transactionList.items.length > 0 ? (
    <>
      {transactionList.items.map((record, index) => {
        return (
          <AccountRecord
            key={index}
            handleRecordToggle={handleRecordToggle}
            index={index}
            selectedRecord={selectedRecord}
            record={record}
            paymentHistory={transactionList}
          />
        );
      })}
      {isModalOpen && selectedRecord !== null && (
        <AccountRecord
          isModal={true}
          handleRecordToggle={handleRecordToggle}
          selectedRecord={selectedRecord}
          paymentHistory={transactionList}
          record={transactionList.items[selectedRecord]}
        />
      )}
    </>
  ) : (
    transactionList && <TransactionsNotFound />
  );
};

export default Transactions;
