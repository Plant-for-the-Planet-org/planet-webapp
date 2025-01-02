import React, { useEffect, useState } from 'react';
import DashboardView from '../../../common/Layout/DashboardView';
import { useTranslations } from 'next-intl';
import ProjectFilter from './components/ProjectFilter';
import { Project, useAnalytics } from '../../../common/Layout/AnalyticsContext';
import { DataExplorerGridContainer } from './components/DataExplorerGridContainer';
import { getAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { APIError, handleError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { MapProject } from '../../../common/types/ProjectPropsContextInterface';
import { useTenant } from '../../../common/Layout/TenantContext';
import NoProjectsFound from './components/NoProjectsFound';

const Analytics = () => {
  const t = useTranslations('TreemapperAnalytics');
  const { projectList, setProjectList, setProject } = useAnalytics();
  const [isLoaded, setIsLoaded] = useState(false);
  const { token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = React.useContext(ErrorHandlingContext);

  const fetchProjects = async () => {
    try {
      // TODO - update project type, this does not match completely
      const res = await getAuthenticatedRequest<MapProject[]>({
        tenant: tenantConfig?.id,
        url: '/app/profile/projects?scope=map',
        token,
        logoutUser,
      });
      const projects: Project[] = [];

      res.forEach((_proj) => {
        const { id, name } = _proj.properties;
        const proj = { id, name };
        projects.push(proj);
      });

      setProjectList(projects);
      setIsLoaded(true);
      if (projects.length > 0) setProject(projects[0]);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return isLoaded ? (
    <DashboardView title={t('title')} subtitle={null}>
      {projectList && projectList.length > 0 ? (
        <>
          <ProjectFilter />
          <DataExplorerGridContainer />
        </>
      ) : (
        <NoProjectsFound />
      )}
    </DashboardView>
  ) : null;
};

export default Analytics;
