import React, { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import BackButton from '../../../../public/assets/images/icons/BackButton';
import TransactionListLoader from '../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../public/assets/images/icons/TransactionsNotFound';
import AccountRecord, {
  BankDetails,
  Certificates,
  DetailsComponent,
  RecordHeader,
  showStatusNote,
  TransferDetails,
} from './components/AccountRecord';
import styles from './AccountHistory.module.scss';
import { useRouter } from 'next/router';

interface Props {
  filter: string | null;
  setFilter: (filter: string) => void;
  isDataLoading: boolean;
  accountingFilters: Payments.Filters | null;
  paymentHistory: Payments.PaymentHistory | null;
  fetchPaymentHistory: (next?: boolean) => Promise<void>;
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
  const [selectedRecord, setSelectedRecord] = React.useState<number | null>(
    null
  );
  const [openModal, setOpenModal] = React.useState(false);
  const router = useRouter();

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

  let currentRecord: Payments.PaymentHistoryRecord | null = null;
  if (paymentHistory && Array.isArray(paymentHistory?.items)) {
    currentRecord =
      selectedRecord !== null && Number.isInteger(selectedRecord)
        ? paymentHistory?.items[selectedRecord]
        : null;
  }

  const adSpaceLanguage = i18n.language === 'de' ? 'de' : 'en';

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
        <iframe
          src={`https://www5.plant-for-the-planet.org/membership-cta/${adSpaceLanguage}/`}
          className={styles.topAdSpace}
        />
        <div className={styles.section}>
          <div className={styles.accountHistory}>
            <div className={styles.historyList}>
              {!paymentHistory && isDataLoading ? (
                <>
                  <TransactionListLoader />
                  <TransactionListLoader />
                  <TransactionListLoader />
                </>
              ) : paymentHistory &&
                Array.isArray(paymentHistory?.items) &&
                paymentHistory.items.length === 0 ? (
                <div className={styles.notFound}>
                  <TransactionsNotFound />
                </div>
              ) : (
                paymentHistory &&
                Array.isArray(paymentHistory?.items) &&
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
                  style={{ minWidth: '240px', marginTop: '30px' }}
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
          <div className={styles.filterContent}>
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
            <iframe
              src={`https://www5.plant-for-the-planet.org/membership-cta/${adSpaceLanguage}/`}
              className={styles.rightAdSpace}
            />
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
                  <RecordHeader
                    record={currentRecord}
                    handleRecordOpen={handleRecordOpen}
                  />
                  <div className={styles.divider}></div>
                  <div className={styles.detailContainer}>
                    <div className={styles.detailGrid}>
                      <DetailsComponent record={currentRecord} />
                    </div>
                    {currentRecord?.details?.recipientBank && (
                      <>
                        <div className={styles.title}>{t('bankDetails')}</div>
                        <div className={styles.detailGrid}>
                          <BankDetails
                            recipientBank={currentRecord.details.recipientBank}
                          />
                        </div>
                      </>
                    )}
                    {currentRecord.details?.account && (
                      <TransferDetails
                        account={currentRecord.details.account}
                      />
                    )}
                    {showStatusNote(currentRecord, t)}
                    {(currentRecord?.details?.donorCertificate ||
                      currentRecord?.details?.taxDeductibleReceipt ||
                      currentRecord?.details?.giftCertificate) && (
                      <>
                        <div className={styles.title}>{t('downloads')}</div>
                        <div className={styles.detailGrid}>
                          <Certificates recordDetails={currentRecord.details} />
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
