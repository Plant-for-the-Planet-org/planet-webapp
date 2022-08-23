import { ReactElement, useContext, useState, useEffect } from 'react';

import AccountRecord from '../../Account/components/AccountRecord';

import { getAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';

const Transactions = (): ReactElement => {
  const { token, contextLoaded } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);
  const [transactionList, setTransactionList] =
    useState<Payments.PaymentHistory | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);

  const handleRecordToggle = (index: number) => {
    if (selectedRecord === index) {
      setSelectedRecord(null);
    } else {
      setSelectedRecord(index);
    }
  };

  const fetchTransactions = async () => {
    if (contextLoaded && token) {
      const transactions: Payments.PaymentHistory =
        await getAuthenticatedRequest(
          `/app/paymentHistory?filter=planet-cash&limit=15`,
          token,
          {},
          handleError,
          '/profile/planetcash'
        );
      setTransactionList(transactions);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [contextLoaded, token]);

  return transactionList ? (
    <>
      {transactionList.items.map((record, index) => {
        return (
          <AccountRecord
            key={index}
            handleRecordOpen={handleRecordToggle}
            index={index}
            selectedRecord={selectedRecord}
            record={record}
            paymentHistory={transactionList}
          />
        );
      })}
    </>
  ) : (
    <div>Loading...</div>
  );
};

export default Transactions;
