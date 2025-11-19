import type { ReactElement } from 'react';
import type { Subscription } from '../../common/types/payments';

import { useEffect, useState } from 'react';
import TransactionListLoader from '../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../public/assets/images/icons/TransactionsNotFound';
import styles from './AccountHistory.module.scss';
import RecurrencyRecord from './components/RecurrencyRecord';
import { PauseModal } from './PauseModal';
import { CancelModal } from './CancelModal';
import { ReactivateModal } from './ReactivateModal';
import { EditModal } from './EditModal';
import { clsx } from 'clsx';

interface Props {
  isDataLoading: boolean;
  recurrencies?: Subscription[];
  fetchRecurrentDonations: (next?: boolean) => void;
}

export default function Recurrency({
  isDataLoading,
  recurrencies,
  fetchRecurrentDonations,
}: Props): ReactElement {
  const [selectedRecord, setSelectedRecord] = useState<number | null>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pauseModalOpen, setPauseModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Subscription | null>(null);

  useEffect(() => {
    if (
      recurrencies &&
      selectedRecord !== null &&
      selectedRecord !== undefined
    ) {
      setCurrentRecord(recurrencies[selectedRecord]);
    }
  }, [selectedRecord, recurrencies]);

  const handleRecordToggle = (index: number | undefined) => {
    if (selectedRecord === index || index === undefined) {
      setSelectedRecord(null);
      setIsModalOpen(false);
    } else {
      setSelectedRecord(index);
      setIsModalOpen(true);
    }
  };

  const handlePauseModalClose = () => {
    setPauseModalOpen(false);
  };
  const handleCancelModalClose = () => {
    setCancelModalOpen(false);
  };
  const handleReactivateModalClose = () => {
    setReactivateModalOpen(false);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={clsx(styles.section, styles.recurrencySection)}>
        <div className={styles.recurrency}>
          <div className={styles.recurrencyList}>
            {!recurrencies && isDataLoading ? (
              <>
                <TransactionListLoader />
                <TransactionListLoader />
                <TransactionListLoader />
              </>
            ) : recurrencies && recurrencies.length === 0 ? (
              <div className={styles.notFound}>
                <TransactionsNotFound />
              </div>
            ) : (
              recurrencies &&
              !isDataLoading &&
              Array.isArray(recurrencies) &&
              recurrencies?.map((record, index) => {
                return (
                  <RecurrencyRecord
                    key={index}
                    handleRecordToggle={handleRecordToggle}
                    index={index}
                    selectedRecord={selectedRecord}
                    record={record}
                    recurrencies={recurrencies}
                    setEditDonation={setEditModalOpen}
                    setPauseDonation={setPauseModalOpen}
                    setCancelDonation={setCancelModalOpen}
                    setReactivateDonation={setReactivateModalOpen}
                  />
                );
              })
            )}
          </div>
        </div>
        {isModalOpen && recurrencies?.length && selectedRecord !== null && (
          <RecurrencyRecord
            isModal={true}
            handleRecordToggle={handleRecordToggle}
            selectedRecord={selectedRecord}
            record={recurrencies[selectedRecord]}
            recurrencies={recurrencies}
            setEditDonation={setEditModalOpen}
            setPauseDonation={setPauseModalOpen}
            setCancelDonation={setCancelModalOpen}
            setReactivateDonation={setReactivateModalOpen}
          />
        )}
      </div>
      {currentRecord !== null && (
        <>
          <PauseModal
            pauseModalOpen={pauseModalOpen}
            handlePauseModalClose={handlePauseModalClose}
            record={currentRecord}
            fetchRecurrentDonations={fetchRecurrentDonations}
          />
          <CancelModal
            cancelModalOpen={cancelModalOpen}
            handleCancelModalClose={handleCancelModalClose}
            record={currentRecord}
            fetchRecurrentDonations={fetchRecurrentDonations}
          />
          <EditModal
            editModalOpen={editModalOpen}
            handleEditModalClose={handleEditModalClose}
            record={currentRecord}
            fetchRecurrentDonations={fetchRecurrentDonations}
          />
          <ReactivateModal
            reactivateModalOpen={reactivateModalOpen}
            handleReactivateModalClose={handleReactivateModalClose}
            record={currentRecord}
            fetchRecurrentDonations={fetchRecurrentDonations}
          />
        </>
      )}
    </div>
  );
}
