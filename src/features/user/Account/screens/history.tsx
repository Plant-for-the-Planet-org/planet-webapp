import React, { useEffect, ReactElement } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from '../styles/AccountNavbar.module.scss';
import { getAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import PaymentRecord from '../components/PaymentRecord';
import TopProgressBar from '../../../common/ContentLoaders/TopProgressBar';
import i18next from '../../../../../i18n';
import TransactionListLoader from '../../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../../public/assets/images/icons/TransactionsNotFound';
import FilterLoader from '../../../../../public/assets/images/icons/FilterLoader';
import FilterInlineLoader from '../../../../../public/assets/images/icons/FilterInlineLoader';

const { useTranslation } = i18next;

interface Props {
  filter: string;
  setFilter: Function;
  isDataLoading: boolean;
  accountingFilters: Object;
  paymentHistory: Object;
}

function History({
  filter,
  setFilter,
  isDataLoading,
  accountingFilters,
  paymentHistory,
}: Props): ReactElement {
  const { t } = useTranslation(['me']);

  const handleSetFilter = (id: any) => {
    setFilter(id);
  };

  return (
    <>
      <div className={styles.accountsPage}>
        <div className={styles.accountsPageContainer}>
          <div className={styles.filterContainer}>
            {isDataLoading ? (
              <FilterInlineLoader />
            ) : (
              <>
                {accountingFilters && (
                  <FilterButtons
                    accountingFilters={accountingFilters}
                    handleSetFilter={handleSetFilter}
                    filter={filter}
                    t={t}
                  />
                )}
              </>
            )}
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.accountsContainer}>
              {isDataLoading ? (
                <>
                  <TransactionListLoader />
                  <TransactionListLoader />
                  <TransactionListLoader />
                </>
              ) : paymentHistory && paymentHistory.items.length === 0 ? (
                <div className={styles.notFound}>
                  {/* <TransactionIcon color={'#c5c5c5'} width={'50px'} />
                <p>{t('me:noRecords')}</p> */}
                  <TransactionsNotFound />
                </div>
              ) : (
                paymentHistory &&
                paymentHistory?.items?.map((item, index) => {
                  return (
                    <PaymentRecord key={index} record={item} index={index} />
                  );
                })
              )}
            </div>
            <div className={styles.filterContainerDesktop}>
              <div className={styles.filterHead}>
                <p className={styles.filterTitle}>{t('me:filters')}</p>
              </div>
              {isDataLoading ? (
                <FilterLoader />
              ) : (
                <div className={styles.filterGrid}>
                  {accountingFilters && (
                    <FilterButtons
                      accountingFilters={accountingFilters}
                      handleSetFilter={handleSetFilter}
                      filter={filter}
                      t={t}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FilterButtons(props: any) {
  return Object.entries(props.accountingFilters).map((item) => {
    return (
      <button
        className={`${styles.multiSelectInput} ${
          props.filter === item[0] ? styles.multiSelectInputCheckTrue : ''
        }`}
        key={item[0]}
        onClick={() => props.handleSetFilter(item[0])}
      >
        {props.t(item[0])}
      </button>
    );
  });
}

export default History;
