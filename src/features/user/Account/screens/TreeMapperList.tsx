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
  const PlantLocationMap = dynamic(
    () => import('../components/TreeMapper/Map'),
    {
      loading: () => <p>loading</p>,
    }
  );

  // React.useEffect(() => {
  //   if (typeof window !== 'undefined')
  //     if (selectedLocation === '') {
  //       window.addEventListener('scroll', () => reducedHeader(), false);
  //     } else {
  //       window.removeEventListener('scroll', () => reducedHeader(), false);
  //     }

  //   function reducedHeader() {
  //     if (
  //       document.body.scrollTop > 80 ||
  //       document.documentElement.scrollTop > 80
  //     ) {
  //       document.getElementById('title').style.display = 'none';
  //       document.getElementById('pageContainer').style.marginTop = '200px';
  //     } else {
  //       document.getElementById('title').style.display = 'flex';
  //       document.getElementById('pageContainer').style.marginTop = '280px';
  //     }
  //   }
  // }, []);

  return (
    <div id="pageContainer" className={styles.pageContainer}>
      <div className={styles.section}>
        <div className={styles.locationList}>
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
        <div className={styles.mapContainer}>
          <div id="pp-mapbox" className={styles.map}>
            <PlantLocationMap
              locations={plantLocations}
              selectedLocation={selectedLocation}
              setselectedLocation={setselectedLocation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
