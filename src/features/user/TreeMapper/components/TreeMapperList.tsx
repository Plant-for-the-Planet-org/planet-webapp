import type { ReactElement } from 'react';
import type { Links } from '../../../common/types/payments';
import type { SetState } from '../../../common/types/common';
import type {
  Intervention,
  InterventionSingle,
  InterventionMulti,
} from '../../../common/types/intervention';

import React from 'react';
import TransactionListLoader from '../../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../../public/assets/images/icons/TransactionsNotFound';
import styles from '../TreeMapper.module.scss';
import { useTranslations } from 'next-intl';
import TreemapperIntervention from './TreemapperIntervention';

interface Props {
  selectedLocation: InterventionSingle | InterventionMulti | null;
  setSelectedLocation: SetState<InterventionSingle | InterventionMulti | null>;
  intervention: Intervention[];
  isDataLoading: boolean;
  location: InterventionSingle | InterventionMulti | null;
  fetchTreemapperData: Function;
  links: Links | undefined;
}

export default function TreeMapperList({
  selectedLocation,
  setSelectedLocation,
  intervention,
  isDataLoading,
  location,
  fetchTreemapperData,
  links,
}: Props): ReactElement {
  const t = useTranslations('Treemapper');
  return (
    <div
      className={`${location ? styles.hideOnMobile : ''} ${
        styles.locationList
      } ${location ? styles.hideOnMobile : ''}`}
    >
      <div className={styles.pullUpContainer}>
        <div className={styles.pullUpBar}></div>
      </div>
      {!intervention && isDataLoading ? (
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
          {intervention ? (
            intervention.map((location, index: number) => {
              if (location.type !== 'sample-tree-registration')
                return (
                  <TreemapperIntervention
                    key={index}
                    location={location}
                    locations={intervention}
                    index={index}
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                  />
                );
            })
          ) : (
            <div className={styles.notFound}>
              <TransactionsNotFound />
            </div>
          )}
          {intervention && links?.next && (
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
