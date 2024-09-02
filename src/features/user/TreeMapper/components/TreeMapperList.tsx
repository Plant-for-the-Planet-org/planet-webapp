import React, { ReactElement } from 'react';
import TransactionListLoader from '../../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../../public/assets/images/icons/TransactionsNotFound';
import styles from '../TreeMapper.module.scss';
import { useTranslations } from 'next-intl';
import {
  SamplePlantLocation,
  PlantLocation as PlantLocationType,
  PlantLocationSingle,
  PlantLocationMulti,
} from '../../../common/types/plantLocation';
import { Links } from '../../../common/types/payments';
import PlantLocation from './PlantLocation';
import { SetState } from '../../../common/types/common';

interface Props {
  selectedLocation: PlantLocationSingle | PlantLocationMulti | null;
  setSelectedLocation: SetState<
    PlantLocationSingle | PlantLocationMulti | null
  >;
  plantLocations: PlantLocationType[];
  isDataLoading: boolean;
  location: PlantLocationSingle | PlantLocationMulti | null;
  fetchTreemapperData: Function;
  links: Links | undefined;
}

export default function TreeMapperList({
  selectedLocation,
  setSelectedLocation,
  plantLocations,
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
      {!plantLocations && isDataLoading ? (
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
          {plantLocations ? (
            plantLocations.map((location, index: number) => {
              if (location.type !== 'sample-tree-registration')
                return (
                  <PlantLocation
                    key={index}
                    location={location}
                    locations={plantLocations}
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
          {plantLocations && links?.next && (
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
