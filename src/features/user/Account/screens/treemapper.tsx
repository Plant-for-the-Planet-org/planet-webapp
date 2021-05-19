import React, { ReactElement } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from '../styles/TreeMapper.module.scss';
import { getAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import TopProgressBar from '../../../common/ContentLoaders/TopProgressBar';
import i18next from '../../../../../i18n';
import TransactionListLoader from '../../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../../public/assets/images/icons/TransactionsNotFound';
import PlantLocation from '../components/TreeMapper/PlantLocation';
import dynamic from 'next/dynamic';

const PlantLocationMap = dynamic(() => import('../components/TreeMapper/Map'), {
  loading: () => <p>loading</p>,
});

const { useTranslation } = i18next;

interface Props {
  selectedLocation: string;
  setselectedLocation: Function;
  plantLocations: Object;
  setPlantLocations: Function;
  isDataLoading: boolean;
  setIsDataLoading: Function;
  progress: number;
  setProgress: Function;
}

function TreeMapper({
  selectedLocation,
  setselectedLocation,
  plantLocations,
  isDataLoading,
}: Props): ReactElement {
  return (
    <div className={styles.accountsPageContainer}>
      <div className={styles.contentContainer}>
        <div className={styles.accountsContainer}>
          {isDataLoading ? (
            <>
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
        <PlantLocationMap
          locations={plantLocations}
          selectedLocation={selectedLocation}
          setselectedLocation={setselectedLocation}
        />
      </div>
    </div>
  );
}

export default TreeMapper;
