import React, { ReactElement } from 'react';
import i18next from '../../i18n';
import styles from '../../src/features/user/Account/styles/TreeMapper.module.scss';
import TreeMapperList from '../../src/features/user/Account/screens/TreeMapperList';
import { useAuth0 } from '@auth0/auth0-react';
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';
import TopProgressBar from '../../src/features/common/ContentLoaders/TopProgressBar';
import AccountFooter from '../../src/features/common/Layout/Footer/accountFooter';
import NewAccountHeader from '../../src/features/common/Layout/Header/AccountHeader';
import PlantLocationPage from '../../src/features/user/Account/screens/PlantLocation';
import dynamic from 'next/dynamic';

const { useTranslation } = i18next;

interface Props {}

const PlantLocationMap = dynamic(
  () => import('../../src/features/user/Account/components/TreeMapper/Map'),
  {
    loading: () => <p>loading</p>,
  }
);

function History({}: Props): ReactElement {
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();
  const { t } = useTranslation(['treemapper']);
  const [progress, setProgress] = React.useState(0);
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [plantLocations, setPlantLocations] = React.useState(null);
  const [selectedLocation, setselectedLocation] = React.useState('');
  const [location, setLocation] = React.useState(null);

  React.useEffect(() => {
    async function fetchPaymentHistory() {
      setIsDataLoading(true);
      setProgress(70);
      let token = null;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
        const response = await getAuthenticatedRequest(
          '/treemapper/plantLocations',
          token
        );
        var plantLocations = response;
        // for (const key in response) {
        //   if (Object.prototype.hasOwnProperty.call(response, key)) {
        //     const item = response[key];
        //     if (item.type === 'sample') {
        //       for (const key in plantLocations) {
        //         if (Object.prototype.hasOwnProperty.call(plantLocations, key)) {
        //           const location = plantLocations[key];
        //           if (item.parent === location.id) {
        //             plantLocations[key].sampleTrees.push(item);
        //           }
        //         }
        //       }
        //     }
        //   }
        // }
        if (plantLocations.length === 0) {
          setPlantLocations(null);
        } else {
          for (const itr in plantLocations) {
            if (Object.prototype.hasOwnProperty.call(plantLocations, itr)) {
              const location = plantLocations[itr];
              if (location.type === 'multi') {
                plantLocations[itr].sampleTrees = [];
                for (const key in plantLocations) {
                  if (
                    Object.prototype.hasOwnProperty.call(plantLocations, key)
                  ) {
                    const item = plantLocations[key];
                    if (item.type === 'sample') {
                      if (item.parent === location.id) {
                        plantLocations[itr].sampleTrees.push(item);
                      }
                    }
                  }
                }
              }
            }
          }
          setPlantLocations(plantLocations);
        }

        setProgress(100);
        setIsDataLoading(false);
        setTimeout(() => setProgress(0), 1000);
      } else {
        localStorage.setItem('redirectLink', '/account/treemapper');
        loginWithRedirect({
          redirectUri: `${process.env.NEXTAUTH_URL}/login`,
          ui_locales: localStorage.getItem('language') || 'en',
        });
      }
    }
    if (!isLoading) fetchPaymentHistory();
  }, [isLoading, isAuthenticated]);

  React.useEffect(() => {
    if (selectedLocation !== '') {
      for (const key in plantLocations) {
        if (Object.prototype.hasOwnProperty.call(plantLocations, key)) {
          const plantLocation = plantLocations[key];
          if (selectedLocation === plantLocation.id) {
            setLocation(plantLocation);
            break;
          }
        }
      }
    } else {
      setLocation(null);
    }
  }, [selectedLocation]);

  const TreeMapperProps = {
    location,
    setLocation,
    selectedLocation,
    setselectedLocation,
    plantLocations,
    isDataLoading,
  };

  return (
    <>
      {progress > 0 && (
        <div className={styles.topLoader}>
          <TopProgressBar progress={progress} />
        </div>
      )}
      <NewAccountHeader page={'treemapper'} title={t('me:myAccount')} />
      <div id="pageContainer" className={styles.pageContainer}>
        <div className={styles.section}>
          {location === null ? (
            <>
              <TreeMapperList {...TreeMapperProps} />
            </>
          ) : (
            <PlantLocationPage {...TreeMapperProps} />
          )}
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
      <AccountFooter />
    </>
  );
}

export default History;
