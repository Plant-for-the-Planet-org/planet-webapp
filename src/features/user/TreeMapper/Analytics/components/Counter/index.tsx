import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '../../../../../common/Layout/AnalyticsContext';
import { CounterItem } from './components/CounterItem';
import styles from './index.module.scss';
import { Grid } from '@mui/material';
import useNextRequest, {
  HTTP_METHOD,
} from '../../../../../../hooks/use-next-request';
import { TotalSpeciesPlanted } from '../../../../../../../pages/api/data-explorer/total-species-planted';
import { TotalTreesPlanted } from '../../../../../../../pages/api/data-explorer/total-trees-planted';

export const Counter = () => {
  const { project, fromDate, toDate } = useAnalytics();
  const { t } = useTranslation(['treemapperAnalytics']);

  const [totalTreesPlanted, setTotalTreesPlanted] = useState<number | null>(
    null
  );
  const [totalSpeciesPlanted, setTotalSpeciesPlanted] = useState<number | null>(
    null
  );

  const { makeRequest: _fetchTotalTreesPlanted } =
    useNextRequest<TotalTreesPlanted>(
      '/api/data-explorer/total-trees-planted',
      HTTP_METHOD.POST,
      {
        projectId: project?.id,
        startDate: fromDate,
        endDate: toDate,
      }
    );

  const { makeRequest: _fetchTotalSpeciesPlanted } =
    useNextRequest<TotalSpeciesPlanted>(
      '/api/data-explorer/total-species-planted',
      HTTP_METHOD.POST,
      {
        projectId: project?.id,
        startDate: fromDate,
        endDate: toDate,
      }
    );

  const fetchTotalTreesPlanted = async () => {
    const result = await _fetchTotalTreesPlanted();
    if (result) {
      setTotalTreesPlanted(result.totalTreesPlanted);
    }
  };

  const fetchTotalSpeciesPlanted = async () => {
    const result = await _fetchTotalSpeciesPlanted();
    if (result) {
      setTotalSpeciesPlanted(result.totalSpeciesPlanted);
    }
  };

  useEffect(() => {
    if (project) {
      fetchTotalTreesPlanted();
      fetchTotalSpeciesPlanted();
    }
  }, [project, fromDate, toDate]);

  return (
    <Grid container alignContent="center" className={styles.container}>
      {totalSpeciesPlanted !== null && totalSpeciesPlanted !== undefined && (
        <CounterItem
          quantity={totalSpeciesPlanted}
          label={t('speciesPlanted')}
        />
      )}
      {totalTreesPlanted !== null && totalTreesPlanted !== undefined && (
        <CounterItem quantity={totalTreesPlanted} label={t('treesPlanted')} />
      )}
    </Grid>
  );
};
