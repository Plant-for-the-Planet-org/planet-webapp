import type {
  APIError,
  Intervention,
  SampleTreeRegistration,
} from '@planet-sdk/common';
import type { Links } from '../../common/types/payments';
import type { ReactElement } from 'react';

import { useEffect, useState, useContext } from 'react';
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

interface Filters {
  all: string;
  'location-partial': string;
  'location-complete': string;
  'location-single': string;
  'location-multi': string;
  'location-sample': string;
  'revision-pending': string;
}
export interface ExtendedScopeInterventions {
  items: Intervention[] | SampleTreeRegistration[];
  total: number;
  count: number;
  _links: Links;
  _filters: Filters;
}

function TreeMapper(): ReactElement {
  const router = useRouter();
  const { token, contextLoaded } = useUserProps();
  const t = useTranslations('Treemapper');
  const { getApiAuthenticated } = useApi();
  const [progress, setProgress] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<
    Intervention | SampleTreeRegistration | null
  >(null);
  const { redirect, setErrors } = useContext(ErrorHandlingContext);
  const [links, setLinks] = useState<Links>();

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
              const intervention = newInterventions[Number(itr)];
              if (intervention.type === 'multi-tree-registration') {
                for (const key in newInterventions) {
                  if (
                    Object.prototype.hasOwnProperty.call(newInterventions, key)
                  ) {
                    const item = newInterventions[key];
                    if (item.type === 'sample-tree-registration') {
                      if (item.parent === intervention.id) {
                        intervention.sampleInterventions.push(item);
                      }
                    }
                  }
                }
              }
            }
          }
          setInterventions([
            ...interventions,
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
                const intervention = interventions[itr];
                if (intervention?.type === 'multi-tree-registration') {
                  for (const key in interventions) {
                    if (
                      Object.prototype.hasOwnProperty.call(interventions, key)
                    ) {
                      const item = interventions[key];
                      if (item.type === 'sample-tree-registration') {
                        if (item.parent === intervention.id) {
                          intervention.sampleInterventions.push(item);
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

  useEffect(() => {
    if (contextLoaded && token) fetchTreemapperData();
  }, [contextLoaded, token]);

  useEffect(() => {
    if (router.query.l) {
      if (interventions) {
        for (const key in interventions) {
          if (Object.prototype.hasOwnProperty.call(interventions, key)) {
            const singleIntervention = interventions[key];
            if (singleIntervention.id === router.query.l) {
              setSelectedIntervention(singleIntervention);
              break;
            }
          }
        }
      }
    } else {
      setSelectedIntervention(null);
    }
  }, [router.query.l, interventions]);

  const commonProps = {
    selectedIntervention,
    setSelectedIntervention,
    interventions,
  };

  return (
    <div className={styles.profilePage}>
      {progress > 0 && (
        <div className={'topLoader'}>
          <TopProgressBar progress={progress} />
        </div>
      )}

      <div id="pageContainer" className={styles.pageContainer}>
        {selectedIntervention ? (
          <InterventionPage {...commonProps} />
        ) : (
          <div className={styles.listContainer}>
            <div className={styles.titleContainer}>
              <div className={styles.treeMapperTitle}>{t('treeMapper')}</div>
            </div>
            <TreeMapperList
              {...commonProps}
              isDataLoading={isDataLoading}
              fetchTreemapperData={fetchTreemapperData}
              links={links}
            />
          </div>
        )}
        <div className={styles.mapContainer}>
          <InterventionMap
            interventions={interventions}
            selectedIntervention={selectedIntervention}
            setSelectedIntervention={setSelectedIntervention}
          />
        </div>
      </div>
    </div>
  );
}

export default TreeMapper;
