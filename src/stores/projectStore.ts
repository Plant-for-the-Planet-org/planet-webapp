import type { MapProject } from '../features/common/types/projectv2';
import type { ApiConfigBase } from '../hooks/useApi';
import type { APIError, TreeProjectClassification } from '@planet-sdk/common';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useErrorHandlingStore } from './errorHandlingStore';
import { handleError } from '@planet-sdk/common';
import { getTopTreeProjects } from '../utils/projectV2';

interface ProjectStore {
  projects: MapProject[] | null;
  topProjects: MapProject[] | null;
  isProjectsFetching: boolean;
  isProjectsError: boolean;
  showDonatableProjects: boolean;
  projectsLocale: string | null;
  projectsCurrencyCode: string | null;
  selectedClassification: TreeProjectClassification[];
  isSearching: boolean;
  debouncedSearchValue: string;

  fetchProjects: (
    getApi: <T>(url: string, config?: ApiConfigBase) => Promise<T>,
    config: ApiConfigBase
  ) => Promise<void>;
  setShowDonatableProjects: (show: boolean) => void;
  setSelectedClassification: (
    classifications: TreeProjectClassification[]
  ) => void;
  setIsSearching: (isSearching: boolean) => void;
  setDebouncedSearchValue: (value: string) => void;
}

export const useProjectStore = create<ProjectStore>()(
  devtools(
    (set) => ({
      projects: null,
      topProjects: null,
      isProjectsFetching: false,
      isProjectsError: false,
      showDonatableProjects: false,
      projectsLocale: null,
      projectsCurrencyCode: null,
      selectedClassification: [],
      isSearching: false,
      debouncedSearchValue: '',

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

      setShowDonatableProjects: (show) =>
        set(
          { showDonatableProjects: show },
          undefined,
          'projectStore/set_show_donatable_project'
        ),

      setSelectedClassification: (classifications) =>
        set(
          { selectedClassification: classifications },
          undefined,
          'projectStore/set_classification'
        ),

      setIsSearching: (isSearching) =>
        set({ isSearching }, undefined, 'projectStore/set_is_searching'),

      setDebouncedSearchValue: (value) =>
        set(
          { debouncedSearchValue: value },
          undefined,
          'projectStore/set_debounced_search_value'
        ),
    }),
    {
      name: 'ProjectStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
