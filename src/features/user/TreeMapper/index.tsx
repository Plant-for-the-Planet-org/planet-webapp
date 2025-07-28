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
import InterventionPage from './components/InterventionPage';
import TopProgressBar from '../../common/ContentLoaders/TopProgressBar';
import { useRouter } from 'next/router';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';

const InterventionMap = dynamic(() => import('./components/Map'), {
  loading: () => <p>loading</p>,
});

function TreeMapper(): ReactElement {
  const router = useRouter();
  const { token, contextLoaded } = useUserProps();
  const t = useTranslations('Treemapper');
  const { getApiAuthenticated } = useApi();
  const [progress, setProgress] = React.useState(0);
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [intervention, setInterventions] = React.useState<Intervention[]>([]);
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
          const newInterventions = response.items;
          for (const itr in newInterventions) {
            if (Object.prototype.hasOwnProperty.call(newInterventions, itr)) {
              const ind = Number(itr);
              const location = newInterventions[ind];
              if (location.type === 'multi-tree-registration') {
                location.sampleTrees = [];
                for (const key in newInterventions) {
                  if (
                    Object.prototype.hasOwnProperty.call(newInterventions, key)
                  ) {
                    const item = newInterventions[key] as InterventionMulti &
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
          setInterventions([
            ...intervention,
            ...newInterventions,
          ] as Intervention[]);
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
          const interventions = response.items;
          if (interventions?.length === 0) {
            setInterventions([]);
          } else {
            for (const itr in interventions) {
              if (Object.prototype.hasOwnProperty.call(interventions, itr)) {
                const location = interventions[itr];
                if (location && location.type === 'multi-tree-registration') {
                  location.sampleTrees = [];
                  for (const key in interventions) {
                    if (
                      Object.prototype.hasOwnProperty.call(interventions, key)
                    ) {
                      const item = interventions[key] as InterventionMulti &
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
            setInterventions(interventions as Intervention[]);
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
      if (intervention) {
        for (const key in intervention) {
          if (Object.prototype.hasOwnProperty.call(intervention, key)) {
            const singleIntervention = intervention[key];
            if (singleIntervention.id === router.query.l) {
              setSelectedLocation(intervention);
              break;
            }
          }
        }
      }
    } else {
      setSelectedLocation(null);
    }
  }, [router.query.l, intervention]);

  const TreeMapperProps = {
    location: selectedLocation,
    selectedLocation,
    setSelectedLocation,
    intervention,
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
          <InterventionPage {...TreeMapperProps} />
        ) : (
          <div className={styles.listContainer}>
            <div className={styles.titleContainer}>
              <div className={styles.treeMapperTitle}>{t('treeMapper')}</div>
            </div>
            <TreeMapperList {...TreeMapperProps} />
          </div>
        )}
        <div className={styles.mapContainer}>
          <InterventionMap
            locations={intervention}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </div>
      </div>
    </div>
  );
}

export default TreeMapper;
