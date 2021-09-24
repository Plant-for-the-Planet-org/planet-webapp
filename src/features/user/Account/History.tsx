import React, { ReactElement } from 'react';
import i18next from '../../../../i18n';
import BackButton from '../../../../public/assets/images/icons/BackButton';
import TransactionListLoader from '../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../public/assets/images/icons/TransactionsNotFound';
import AccountRecord, {
  BankDetails,
  Certificates,
  DetailsComponent,
  RecordHeader,
} from './components/AccountRecord';
import styles from './AccountHistory.module.scss';

const { useTranslation } = i18next;

interface Props {
  filter: string;
  setFilter: Function;
  isDataLoading: boolean;
  accountingFilters: Object;
  paymentHistory: Object;
  fetchPaymentHistory: Function;
}

export default function History({
  filter,
  setFilter,
  isDataLoading,
  accountingFilters,
  paymentHistory,
  fetchPaymentHistory,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(['me']);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);

  const handleRecordOpen = (index: number) => {
    if (selectedRecord === index) {
      setSelectedRecord(null);
      setOpenModal(false);
    } else {
      setSelectedRecord(index);
      setOpenModal(true);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedRecord(null);
  };

  const handleSetFilter = (id: any) => {
    setFilter(id);
  };

  let currentRecord;
  if (paymentHistory) {
    currentRecord = paymentHistory?.items[selectedRecord];
  }

  return (
    <div className="profilePage">
      <div className={'profilePageTitle'}>{t('me:payments')}</div>
      <div className={'profilePageSubTitle'}>{t('me:donationsSubTitle')}</div>
      <div className={styles.pageContainer}>
        <div className={styles.filterRow}>
          {accountingFilters &&
            Object.entries(accountingFilters).map((item) => {
              return (
                <div
                  key={item[0]}
                  className={`${styles.filterButton} ${
                    filter === item[0] ? styles.selected : ''
                  }`}
                  onClick={() => handleSetFilter(item[0])}
                >
                  {t(item[0])}
                </div>
              );
            })}
        </div>
        <div className={styles.section}>
          <div className={styles.accountHistory}>
            <div className={styles.historyList}>
              {!paymentHistory && isDataLoading ? (
                <>
                  <TransactionListLoader />
                  <TransactionListLoader />
                  <TransactionListLoader />
                </>
              ) : paymentHistory && paymentHistory.items.length === 0 ? (
                <div className={styles.notFound}>
                  <TransactionsNotFound />
                </div>
              ) : (
                paymentHistory &&
                paymentHistory?.items?.map((record: any, index: number) => {
                  return (
                    <AccountRecord
                      key={index}
                      handleRecordOpen={handleRecordOpen}
                      index={index}
                      selectedRecord={selectedRecord}
                      record={record}
                      paymentHistory={paymentHistory}
                    />
                  );
                })
              )}
            </div>
            {paymentHistory?._links?.next && (
              <div className={styles.pagination}>
                <button
                  onClick={() => fetchPaymentHistory(true)}
                  className="primaryButton"
                  style={{ minWidth: '240px',marginTop:'30px' }}
                >
                  {isDataLoading ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    t('loadMore')
                  )}
                </button>
              </div>
            )}
          </div>
          <div className={styles.filterContainer}>
            <p className={styles.header}>{t('me:filters')}</p>
            <div className={styles.filterGrid}>
              {accountingFilters &&
                Object.entries(accountingFilters).map((item) => {
                  return (
                    <div
                      key={item[0]}
                      className={`${styles.filterButton} ${
                        filter === item[0] ? styles.selected : ''
                      }`}
                      onClick={() => handleSetFilter(item[0])}
                    >
                      {t(item[0])}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {openModal && (
          <div className={styles.modalContainer}>
            <>
              <div
                onClick={() => {
                  handleClose();
                }}
                className={styles.closeRecord}
              >
                <BackButton />
              </div>
              {currentRecord ? (
                <>
                  <RecordHeader record={currentRecord} />
                  <div className={styles.divider}></div>
                  <div className={styles.detailContainer}>
                    <div className={styles.detailGrid}>
                      <DetailsComponent record={currentRecord} />
                    </div>
                    {currentRecord?.details?.recipientBank && (
                      <>
                        <div className={styles.title}>{t('bankDetails')}</div>
                        <div className={styles.detailGrid}>
                          <BankDetails record={currentRecord} />
                        </div>
                      </>
                    )}
                    {(currentRecord.details.donorCertificate ||
                      currentRecord.details.taxDeductibleReceipt ||
                      currentRecord.details.giftCertificate) && (
                      <>
                        <div className={styles.title}>{t('downloads')}</div>
                        <div className={styles.detailGrid}>
                          <Certificates record={currentRecord} />
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : null}
            </>
          </div>
        )}
      </div>
    </div>
  );
}
