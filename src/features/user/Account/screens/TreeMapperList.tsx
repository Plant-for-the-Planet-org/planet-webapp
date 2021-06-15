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
  location: any;
}

export default function TreeMapperNew({
  selectedLocation,
  setselectedLocation,
  plantLocations,
  isDataLoading,
  location,
}: Props): ReactElement {
  console.log(plantLocations);

  return (
    <div
      className={`${location ? styles.hideOnMobile : ''} ${
        styles.locationList
      } ${location ? styles.hideOnMobile : ''}`}
    >
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
      ) : plantLocations ? (
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
      ) : (
        <div className={styles.notFound}>
          <TransactionsNotFound />
        </div>
      )}
    </div>
  );
}
