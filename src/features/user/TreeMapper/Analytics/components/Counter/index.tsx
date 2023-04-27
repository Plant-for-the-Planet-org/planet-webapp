import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '../../../../../common/Layout/AnalyticsContext';
import { ErrorHandlingContext } from '../../../../../common/Layout/ErrorHandlingContext';
import { CounterItem } from './components/CounterItem';
import styles from './index.module.scss';
import { Grid } from '@mui/material';

export const Counter = () => {
  const { project, fromDate, toDate } = useAnalytics();
  const { t } = useTranslation(['treemapperAnalytics']);
  const { handleError } = useContext(ErrorHandlingContext);

  const [totalTreesPlanted, setTotalTreesPlanted] = useState<number | null>(
    null
  );
  const [totalSpeciesPlanted, setTotalSpeciesPlanted] = useState<number | null>(
    null
  );

  const fetchTotalTreesPlanted = async () => {
    // TODO - Once error handling PR is merged refactor this fetch call with a makeNextRequest function

    try {
      const res = await fetch('/api/data-explorer/total-trees-planted', {
        method: 'POST',
        body: JSON.stringify({
          projectId: project?.id,
          startDate: fromDate,
          endDate: toDate,
        }),
      });

      if (res.status === 429) {
        handleError({ message: t('errors.tooManyRequest'), type: 'error' });
        return;
      }

      const { data } = await res.json();

      setTotalTreesPlanted(data.totalTreesPlanted);
    } catch (err) {
      handleError({ message: t('wentWrong'), type: 'error' });
    }
  };

  const fetchTotalSpeciesPlanted = async () => {
    // TODO - Once error handling PR is merged refactor this fetch call with a makeNextRequest function

    try {
      const res = await fetch('/api/data-explorer/total-species-planted', {
        method: 'POST',
        body: JSON.stringify({
          projectId: project?.id,
          startDate: fromDate,
          endDate: toDate,
        }),
      });

      if (res.status === 429) {
        handleError({ message: t('errors.tooManyRequest'), type: 'error' });
        return;
      }

      const { data } = await res.json();

      setTotalSpeciesPlanted(data.totalSpeciesPlanted);
    } catch (err) {
      handleError({ message: t('wentWrong'), type: 'error' });
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
