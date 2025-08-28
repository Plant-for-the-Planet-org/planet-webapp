import type { Project } from '../../../common/Layout/AnalyticsContext';
import type { APIError, ProfileProjectFeature } from '@planet-sdk/common';

import React, { useEffect, useState } from 'react';
import DashboardView from '../../../common/Layout/DashboardView';
import { useTranslations } from 'next-intl';
import ProjectFilter from './components/ProjectFilter';
import { useAnalytics } from '../../../common/Layout/AnalyticsContext';
import { DataExplorerGridContainer } from './components/DataExplorerGridContainer';
import { handleError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import NoProjectsFound from './components/NoProjectsFound';
import { useApi } from '../../../../hooks/useApi';

const Analytics = () => {
  const t = useTranslations('TreemapperAnalytics');
  const { projectList, setProjectList, setProject } = useAnalytics();
  const [isLoaded, setIsLoaded] = useState(false);
  const { getApiAuthenticated } = useApi();
  const { setErrors } = React.useContext(ErrorHandlingContext);

  const fetchProjects = async () => {
    try {
      const res = await getApiAuthenticated<ProfileProjectFeature[]>(
        '/app/profile/projects',
        {
          queryParams: { scope: 'map' },
        }
      );
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
    <DashboardView title={t('title')}>
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
