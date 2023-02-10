import React, { Dispatch, SetStateAction } from 'react';
import DashboardView from '../../../common/Layout/DashboardView';
import { useTranslation } from 'react-i18next';

interface Props {
  setProgress: Dispatch<SetStateAction<number>>;
}

const Analytics = ({ setProgress }: Props) => {
  const { t, ready } = useTranslation('treemapperAnalytics');

  return ready ? (
    <DashboardView title={t('treemapperAnalytics:title')} subtitle={null}>
      <h1>Graphs</h1>
    </DashboardView>
  ) : null;
};

export default Analytics;
