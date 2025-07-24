import type { APIError } from '@planet-sdk/common';
import type {
  ExtendedScopeInterventions,
  Intervention,
  InterventionMulti,
  InterventionSingle,
  SampleIntervention,
} from '../../common/types/intervention';
import type { Links } from '../../common/types/payments';
import type { ReactElement } from 'react';

import React from 'react';
import styles from './TreeMapper.module.scss';
import dynamic from 'next/dynamic';
import TreeMapperList from './components/TreeMapperList';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import PlantLocationPage from './components/PlantLocationPage';
import TopProgressBar from '../../common/ContentLoaders/TopProgressBar';
import { useRouter } from 'next/router';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';

const PlantLocationMap = dynamic(() => import('./components/Map'), {
  loading: () => <p>loading</p>,
});

function TreeMapper(): ReactElement {
  const router = useRouter();
  const { token, contextLoaded } = useUserProps();
  const t = useTranslations('Treemapper');
  const { getApiAuthenticated } = useApi();
  const [progress, setProgress] = React.useState(0);
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [plantLocations, setPlantLocations] = React.useState<Intervention[]>(
    []
  );
  const [selectedLocation, setSelectedLocation] = React.useState<
    InterventionSingle | InterventionMulti | null
  >(null);
  const [links, setLinks] = React.useState<Links>();
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  async function fetchTreemapperData(next = false) {
    setIsDataLoading(true);
    setProgress(70);

    if (next && links?.next) {
      try {
        const response = await getApiAuthenticated<ExtendedScopeInterventions>(
          links.next // The 'links.next' URL contains query parameters and is passed as-is since no additional parameters are being added.
        );
        if (response?.items) {
          const newPlantLocations = response.items;
          for (const itr in newPlantLocations) {
            if (Object.prototype.hasOwnProperty.call(newPlantLocations, itr)) {
              const ind = Number(itr);
              const location = newPlantLocations[ind];
              if (location.type === 'multi-tree-registration') {
                location.sampleTrees = [];
                for (const key in newPlantLocations) {
                  if (
                    Object.prototype.hasOwnProperty.call(newPlantLocations, key)
                  ) {
                    const item = newPlantLocations[key] as InterventionMulti &
                      SampleIntervention;
                    if (item.type === 'sample-tree-registration') {
                      if (item.parent === location.id) {
                        location.sampleTrees.push(item);
                      }
                    }
                  }
                }
              }
            }
          }
          setPlantLocations([
            ...plantLocations,
            ...newPlantLocations,
          ] as PlantLocationType[]);
          setLinks(response._links);
        }
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/profile');
      }
    } else {
      try {
        const response = await getApiAuthenticated<ExtendedScopeInterventions>(
          '/treemapper/interventions',
          {
            queryParams: { _scope: 'extended', limit: '15' },
          }
        );
        if (response?.items) {
          const plantLocations = response.items;
          if (plantLocations?.length === 0) {
            setPlantLocations([]);
          } else {
            for (const itr in plantLocations) {
              if (Object.prototype.hasOwnProperty.call(plantLocations, itr)) {
                const location = plantLocations[itr];
                if (location && location.type === 'multi-tree-registration') {
                  location.sampleTrees = [];
                  for (const key in plantLocations) {
                    if (
                      Object.prototype.hasOwnProperty.call(plantLocations, key)
                    ) {
                      const item = plantLocations[key] as InterventionMulti &
                        SampleIntervention;
                      if (item.type === 'sample-tree-registration') {
                        if (item.parent === location.id) {
                          location.sampleTrees.push(item);
                        }
                      }
                    }
                  }
                }
              }
            }
            setPlantLocations(plantLocations as Intervention[]);
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
              setSelectedLocation(plantLocation);
              break;
            }
          }
        }
      }
    } else {
      setSelectedLocation(null);
    }
  }, [router.query.l, plantLocations]);

  const TreeMapperProps = {
    location: selectedLocation,
    selectedLocation,
    setSelectedLocation,
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
              <div className={styles.treeMapperTitle}>{t('treeMapper')}</div>
            </div>
            <TreeMapperList {...TreeMapperProps} />
          </div>
        )}
        <div className={styles.mapContainer}>
          <PlantLocationMap
            locations={plantLocations}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </div>
      </div>
    </div>
  );
}

export default TreeMapper;
