import React, { Dispatch, SetStateAction } from 'react';
import DashboardView from '../../../common/Layout/DashboardView';
import { useTranslation } from 'react-i18next';
import ProjectFilter from './components/Filter';

interface Props {
  setProgress: Dispatch<SetStateAction<number>>;
}

const Analytics = ({ setProgress }: Props) => {
  const { t, ready } = useTranslation('treemapperAnalytics');

  return ready ? (
    <DashboardView title={t('treemapperAnalytics:title')} subtitle={null}>
      <ProjectFilter  {...{setProgress}} />
    </DashboardView>
  ) : null;
};

export default Analytics;
