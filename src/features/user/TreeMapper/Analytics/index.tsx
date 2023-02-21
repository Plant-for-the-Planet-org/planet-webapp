import React, { Dispatch, SetStateAction, useEffect } from 'react';
import DashboardView from '../../../common/Layout/DashboardView';
import { useTranslation } from 'react-i18next';
import ProjectFilter from './components/Filter';
import { useAnalytics } from '../../../common/Layout/AnalyticsContext';

interface Props {
  setProgress: Dispatch<SetStateAction<number>>;
}

const tempProjectList = [{
  guid: "proj_asdf",
  slug: "yucatan",
  name: "Yucatan"
},
{
  guid: "proj_qwer",
  slug: "lacruzhabitat",
  name: "Mexico Reforestation Project"
},
{
  guid: "proj_poiu",
  slug: "one-student-one-tree",
  name: "One student One tree and conservation Education"
},
{
  guid: "proj_asdf",
  slug: "making-madagascar-green-again",
  name: "Making Madagascar Green-Again"
},
]

const Analytics = ({ setProgress }: Props) => {
  const { t, ready } = useTranslation('treemapperAnalytics');
  const {setProjectList} = useAnalytics()

  useEffect(() => {
    // fetch and set projectList mock
    setProjectList(tempProjectList)
  }, [])

  return ready ? (
    <DashboardView title={t('treemapperAnalytics:title')} subtitle={null}>
      <ProjectFilter  {...{setProgress}} />
    </DashboardView>
  ) : null;
};

export default Analytics;
