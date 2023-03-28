import React, { useContext, useEffect } from 'react';
import DashboardView from '../../../common/Layout/DashboardView';
import { useTranslation } from 'react-i18next';
import ProjectFilter from './components/ProjectFilter';
import { Project, useAnalytics } from '../../../common/Layout/AnalyticsContext';
import { Graphs } from './components/Graphs';
import { getAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { ProjectMapInfo } from '@planet-sdk/common';

const Analytics = () => {
  const { t, ready } = useTranslation('treemapperAnalytics');
  const { setProjectList, setProject } = useAnalytics();

  const { token, impersonatedEmail } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);

  const fetchProjects = async () => {
    const res = await getAuthenticatedRequest<ProjectMapInfo[]>(
      '/app/profile/projects?scope=map',
      token,
      impersonatedEmail,
      {},
      handleError
    );

    const projects: Project[] = [];

    res.forEach((_proj) => {
      const { id, name } = _proj.properties;
      const proj = { id, name };
      projects.push(proj);
    });

    setProjectList(projects);
    if (projects.length > 0) setProject(projects[0]);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return ready ? (
    <DashboardView title={t('treemapperAnalytics:title')} subtitle={null}>
      <ProjectFilter />
      <Graphs />
    </DashboardView>
  ) : null;
};

export default Analytics;
