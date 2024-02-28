import React, { ReactElement } from 'react';
import styles from './TreeMapper.module.scss';
import dynamic from 'next/dynamic';
import TreeMapperList from './components/TreeMapperList';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import PlantLocationPage from './components/PlantLocationPage';
import { getAuthenticatedRequest } from '../../../utils/apiRequests/api';
import TopProgressBar from '../../common/ContentLoaders/TopProgressBar';
import { useRouter } from 'next/router';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { useTranslation } from 'next-i18next';
import { handleError, APIError } from '@planet-sdk/common';
import {
  ExtendedScopePlantLocations,
  PlantLocation,
  SamplePlantLocation,
} from '../../common/types/plantLocation';
import { Links } from '../../common/types/payments';

const PlantLocationMap = dynamic(() => import('./components/Map'), {
  loading: () => <p>loading</p>,
});

function TreeMapper(): ReactElement {
  const router = useRouter();
  const { token, contextLoaded, logoutUser } = useUserProps();
  const { t } = useTranslation(['treemapper']);
  const [progress, setProgress] = React.useState(0);
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [plantLocations, setPlantLocations] = React.useState<
    PlantLocation[] | SamplePlantLocation[] | null
  >(null);
  const [selectedLocation, setselectedLocation] = React.useState<string>('');
  const [links, setLinks] = React.useState<Links>();
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);

  async function fetchTreemapperData(next = false) {
    setIsDataLoading(true);
    setProgress(70);

    if (next && links?.next) {
      try {
        const response =
          await getAuthenticatedRequest<ExtendedScopePlantLocations>(
            links.next,
            token,
            logoutUser,
            {},
            undefined,
            '1.0.4'
          );
        if (response.items) {
          const newPlantLocations = response?.items;
          for (const itr in newPlantLocations) {
            if (Object.prototype.hasOwnProperty.call(newPlantLocations, itr)) {
              const ind = Number(itr);
              const location = newPlantLocations[ind];
              if (location.type === 'multi') {
                location.sampleTrees = [];
                for (const key in newPlantLocations) {
                  if (
                    Object.prototype.hasOwnProperty.call(newPlantLocations, key)
                  ) {
                    const item = newPlantLocations[key];
                    if (item.type === 'sample') {
                      if (item.parent === location.id) {
                        location.sampleTrees.push(item);
                      }
                    }
                  }
                }
              }
            }
          }
          setPlantLocations([...plantLocations, ...newPlantLocations]);
        }
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/profile');
      }
    } else {
      try {
        const response =
          await getAuthenticatedRequest<ExtendedScopePlantLocations>(
            '/treemapper/plantLocations?_scope=extended&limit=15',
            token,
            logoutUser,

            {},
            undefined,
            '1.0.4'
          );
        if (response.items) {
          const plantLocations = response?.items;
          if (plantLocations?.length === 0) {
            setPlantLocations(null);
          } else {
            for (const itr in plantLocations) {
              if (Object.prototype.hasOwnProperty.call(plantLocations, itr)) {
                const location = plantLocations[itr];
                if (location.type === 'multi') {
                  location.sampleTrees = [];
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
            setLinks(response._links);
          }
        }
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/profile');
      }
    }
    setProgress(100);
    setIsDataLoading(false);
    setTimeout(() => setProgress(0), 1000);
  }

  React.useEffect(() => {
    if (contextLoaded && token) fetchTreemapperData();
  }, [contextLoaded, token]);

  React.useEffect(() => {
    if (router.query.l) {
      if (plantLocations) {
        for (const key in plantLocations) {
          if (Object.prototype.hasOwnProperty.call(plantLocations, key)) {
            const plantLocation = plantLocations[key];
            if (plantLocation.id === router.query.l) {
              setselectedLocation(plantLocation);
              break;
            }
          }
        }
      }
    } else {
      setselectedLocation('');
    }
  }, [router.query.l, plantLocations]);

  const TreeMapperProps = {
    location: selectedLocation,
    selectedLocation,
    setselectedLocation,
    plantLocations,
    isDataLoading,
    fetchTreemapperData,
    links,
  };

  return (
    <div className={styles.profilePage}>
      {progress > 0 && (
        <div className={'topLoader'}>
          <TopProgressBar progress={progress} />
        </div>
      )}

      <div id="pageContainer" className={styles.pageContainer}>
        {selectedLocation ? (
          <PlantLocationPage {...TreeMapperProps} />
        ) : (
          <div className={styles.listContainer}>
            <div className={styles.titleContainer}>
              <div className={styles.treeMapperTitle}>
                {t('treemapper:treeMapper')}
              </div>
            </div>
            <TreeMapperList {...TreeMapperProps} />
          </div>
        )}
        <div className={styles.mapContainer}>
          <PlantLocationMap
            locations={plantLocations}
            selectedLocation={selectedLocation}
            setselectedLocation={setselectedLocation}
          />
        </div>
      </div>
    </div>
  );
}

export default TreeMapper;
