import type { MapProject } from '../features/common/types/projectv2';
import type { ApiConfigBase } from '../hooks/useApi';
import type { APIError } from '@planet-sdk/common';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useErrorHandlingStore } from './errorHandlingStore';
import { handleError } from '@planet-sdk/common';
import { getTopTreeProjects } from '../utils/projectV2';

interface ProjectStore {
  projects: MapProject[] | null;
  isProjectsFetching: boolean;
  isProjectsError: boolean;
  topProjects: MapProject[] | null;
  projectsLocale: string | null;
  projectsCurrencyCode: string | null;

  fetchProjects: (
    getApi: <T>(url: string, config?: ApiConfigBase) => Promise<T>,
    config: ApiConfigBase
  ) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>()(
  devtools(
    (set) => ({
      projects: null,
      isProjectsFetching: false,
      isProjectsError: false,
      topProjects: null,
      projectsLocale: null,
      projectsCurrencyCode: null,

      fetchProjects: async (getApi, config) => {
        set(
          { isProjectsFetching: true },
          undefined,
          'projectStore/projects_fetch_start'
        );
        try {
          const projects = await getApi<MapProject[]>('/app/projects', config);

          set(
            {
              projects,
              topProjects: getTopTreeProjects(projects),
              isProjectsFetching: false,
              projectsLocale: config.queryParams?.locale,
              projectsCurrencyCode: config.queryParams?.currency,
              isProjectsError: false,
            },
            undefined,
            'projectStore/projects_fetch_success'
          );
        } catch (error) {
          set(
            {
              isProjectsFetching: false,
              isProjectsError: true,
            },
            undefined,
            'projectStore/projects_fetch_fail'
          );
          useErrorHandlingStore
            .getState()
            .setErrors(handleError(error as APIError));
        }
      },
    }),
    {
      name: 'ProjectStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
