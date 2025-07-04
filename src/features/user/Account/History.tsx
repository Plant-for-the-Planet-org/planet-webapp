import type { ReactElement } from 'react';
import type { Filters, PaymentHistory } from '../../common/types/payments';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import TransactionListLoader from '../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../public/assets/images/icons/TransactionsNotFound';
import AccountRecord from './components/AccountRecord';
import styles from './AccountHistory.module.scss';
import { useRouter } from 'next/router';
import { useProjectProps } from '../../common/Layout/ProjectPropsContext';
import Grid from '@mui/material/Grid';
import MembershipCta from './components/MembershipCta';
interface Props {
  filter: string | null;
  setFilter: (filter: string) => void;
  isDataLoading: boolean;
  accountingFilters: Filters | null;
  paymentHistory: PaymentHistory | null;
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
  const t = useTranslations('Me');
  const [selectedRecord, setSelectedRecord] = React.useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { isMobile } = useProjectProps();
  const router = useRouter();

  const handleRecordToggle = (index: number | undefined) => {
    if (selectedRecord === index || index === undefined) {
      setSelectedRecord(null);
      setIsModalOpen(false);
    } else {
      setSelectedRecord(index);
      setIsModalOpen(true);
    }
  };

  const handleSetFilter = (id: string) => {
    setFilter(id);
  };

  useEffect(() => {
    const { ref } = router.query;
    let refIndex = !isMobile ? 0 : undefined;
    if (paymentHistory?.items && paymentHistory.items.length > 0) {
      if (ref) {
        const _refIndex = paymentHistory?.items?.findIndex(
          (item) => item.reference === ref
        );
        _refIndex && _refIndex !== -1 && (refIndex = _refIndex);
      }
      if (refIndex !== undefined) handleRecordToggle(refIndex);
    }
  }, [paymentHistory]);

  return (
    <div className={styles.pageContainer}>
      <Grid item style={{ width: '100%' }}>
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
      </Grid>
      <Grid item style={{ width: '100%' }}>
        <MembershipCta placement="top" />
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
                paymentHistory?.items?.map((record, index) => {
                  return (
                    <AccountRecord
                      key={index}
                      handleRecordToggle={handleRecordToggle}
                      index={index}
                      selectedRecord={selectedRecord}
                      record={record}
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
              <p className={styles.header}>{t('filters')}</p>
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
            <MembershipCta placement="right" />
          </div>
        </div>
        {isModalOpen &&
          paymentHistory?.items.length &&
          selectedRecord !== null && (
            <AccountRecord
              isModal={true}
              handleRecordToggle={handleRecordToggle}
              selectedRecord={selectedRecord}
              record={paymentHistory.items[selectedRecord]}
            />
          )}
      </Grid>
    </div>
  );
}
