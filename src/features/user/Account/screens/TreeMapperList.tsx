import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import TransactionListLoader from '../../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../../public/assets/images/icons/TransactionsNotFound';
import PlantLocation from '../components/TreeMapper/PlantLocation';
import styles from '../styles/TreeMapper.module.scss';

interface Props {
  selectedLocation: string;
  setselectedLocation: Function;
  plantLocations: Object;
  isDataLoading: boolean;
}

export default function TreeMapperNew({
  selectedLocation,
  setselectedLocation,
  plantLocations,
  isDataLoading,
}: Props): ReactElement {
  return (
    <div className={styles.locationList}>
      <div className={styles.pullUpContainer}>
        <div className={styles.pullUpBar}></div>
      </div>
      {isDataLoading ? (
        <>
          <TransactionListLoader />
          <TransactionListLoader />
          <TransactionListLoader />
          <TransactionListLoader />
        </>
      ) : plantLocations && plantLocations.length === 0 ? (
        <div className={styles.notFound}>
          <TransactionsNotFound />
        </div>
      ) : (
        plantLocations &&
        plantLocations.map((location: any, index: number) => {
          if (location.type !== 'sample')
            return (
              <PlantLocation
                key={index}
                location={location}
                locations={plantLocations}
                index={index}
                selectedLocation={selectedLocation}
                setselectedLocation={setselectedLocation}
              />
            );
        })
      )}
    </div>
  );
}
