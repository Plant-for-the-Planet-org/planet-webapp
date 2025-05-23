import type { Project } from '../../../common/Layout/AnalyticsContext';
import type {
  APIError,
  ConservationProjectConcise,
  ConservationProjectMetadata,
  EcosystemTypes,
  TreeProjectConcise,
  TreeProjectMetadata,
} from '@planet-sdk/common';
import type { Feature as GeoJSONFeature, Point as GeoJSONPoint } from 'geojson';

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

type OmittedProjectProps =
  | 'ecosystem'
  | '_scope'
  | 'fixedRates'
  | 'isPublished'
  | 'reviewScore'
  | 'reviews'
  | 'treeCost'
  | 'description'
  | 'options';

type BaseProject<T> = Omit<T, OmittedProjectProps> & {
  unit: string;
  metadata: Record<string, unknown>;
};

type TreeProject = BaseProject<TreeProjectConcise> & {
  unit: 'tree';
  metadata: TreeProjectMetadata;
};

type ConservationProject = BaseProject<ConservationProjectConcise> & {
  unit: 'm2';
  isApproved: boolean;
  isFeatured: boolean;
  isTopProject: boolean;
  countPlanted: number;
  metadata: ConservationProjectMetadata & {
    ecosystems: EcosystemTypes;
  };
};

export type ProjectMapInfo<T> = GeoJSONFeature<GeoJSONPoint, T>;
/** This evaluates to
 * {
 * type:"Feature",
 * geometry:Geometry object,
 * properties:  TreeProject | ConservationProject
 * } */
export type ProjectApiResponse = ProjectMapInfo<
  TreeProject | ConservationProject
>;

const Analytics = () => {
  const t = useTranslations('TreemapperAnalytics');
  const { projectList, setProjectList, setProject } = useAnalytics();
  const [isLoaded, setIsLoaded] = useState(false);
  const { getApiAuthenticated } = useApi();
  const { setErrors } = React.useContext(ErrorHandlingContext);

  const fetchProjects = async () => {
    try {
      const res = await getApiAuthenticated<ProjectApiResponse[]>(
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
