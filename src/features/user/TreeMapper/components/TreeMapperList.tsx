import type { ReactElement } from 'react';
import type { Links } from '../../../common/types/payments';
import type { SetState } from '../../../common/types/common';
import type {
  Intervention,
  SampleTreeRegistration,
} from '../../../common/types/intervention';

import React from 'react';
import TransactionListLoader from '../../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../../public/assets/images/icons/TransactionsNotFound';
import styles from '../TreeMapper.module.scss';
import { useTranslations } from 'next-intl';
import TreemapperIntervention from './TreemapperIntervention';

interface Props {
  selectedIntervention: Intervention | SampleTreeRegistration | null;
  setSelectedIntervention: SetState<
    Intervention | SampleTreeRegistration | null
  >;
  interventions: Intervention[];
  isDataLoading: boolean;
  fetchTreemapperData: Function;
  links: Links | undefined;
}

export default function TreeMapperList({
  selectedIntervention,
  setSelectedIntervention,
  interventions,
  isDataLoading,
  fetchTreemapperData,
  links,
}: Props): ReactElement {
  const t = useTranslations('Treemapper');

  return (
    <div
      className={`${selectedIntervention ? styles.hideOnMobile : ''} ${
        styles.locationList
      } ${selectedIntervention ? styles.hideOnMobile : ''}`}
    >
      <div className={styles.pullUpContainer}>
        <div className={styles.pullUpBar}></div>
      </div>
      {!interventions && isDataLoading ? (
        <>
          <TransactionListLoader />
          <TransactionListLoader />
          <TransactionListLoader />
          <TransactionListLoader />
          <TransactionListLoader />
          <TransactionListLoader />
          <TransactionListLoader />
          <TransactionListLoader />
          <TransactionListLoader />
          <TransactionListLoader />
          <TransactionListLoader />
          <TransactionListLoader />
        </>
      ) : (
        <>
          {interventions ? (
            interventions.map((intervention, index: number) => {
              return (
                <TreemapperIntervention
                  key={index}
                  intervention={intervention}
                  showDivider={index !== interventions?.length - 1}
                  selectedIntervention={selectedIntervention}
                  setSelectedIntervention={setSelectedIntervention}
                />
              );
            })
          ) : (
            <div className={styles.notFound}>
              <TransactionsNotFound />
            </div>
          )}
          {interventions && links?.next && (
            <div className={styles.pagination}>
              <button
                onClick={() => fetchTreemapperData(true)}
                className="primaryButton"
                style={{ maxWidth: '80px' }}
              >
                {isDataLoading ? (
                  <div className={styles.spinner}></div>
                ) : (
                  t('loadMore')
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
