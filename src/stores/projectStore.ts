import type { MapProject } from '../features/common/types/projectv2';
import type { ApiConfigBase } from '../hooks/useApi';
import type { APIError, TreeProjectClassification } from '@planet-sdk/common';
import type { ApiRequestFn } from '../hooks/useApi';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useErrorHandlingStore } from './errorHandlingStore';
import { handleError } from '@planet-sdk/common';
import { getTopProjects } from '../utils/projectV2';
import { isSameFetchKey } from '../utils/fetchKey';


/**
 * Conditions a fetched project list depends on. No slug, unlike the single
 * project key, since there is one list. See `src/utils/fetchKey.ts`.
 */
type ProjectsFetchKey = {
  locale: string;
  currency: string;
  tenant: string;
};

interface ProjectStore {
  projects: MapProject[] | null;
  /** Subset of projects highlighted in UI (derived from projects response) */
  topProjects: MapProject[] | null;
  isProjectsFetching: boolean;
  isProjectsError: boolean;
  showDonatableProjects: boolean;
  /**
   * Conditions of the last successful fetch. `null` when nothing has been
   * fetched yet or after a failure, so a failed request can always be retried.
   */
  lastFetch: ProjectsFetchKey | null;
  /** Conditions of the request in flight, `null` when idle. */
  pendingFetch: ProjectsFetchKey | null;
  selectedClassification: TreeProjectClassification[];
  isSearching: boolean;
  /** Debounced search input used to avoid excessive filtering/API calls */
  debouncedSearchValue: string;

  fetchProjects: (
    getApi: ApiRequestFn,
    config: ApiConfigBase
  ) => Promise<void>;
  setShowDonatableProjects: (show: boolean) => void;
  setSelectedClassification: (
    classifications: TreeProjectClassification[]
  ) => void;
  setIsSearching: (isSearching: boolean) => void;
  setDebouncedSearchValue: (value: string) => void;
  /** Resets all project filtering & search related UI state */
  clearFilterStates: () => void;
}

/**
 * Handles project listing state including:
 * - Project fetching & caching
 * - Filtering and search UI state
 * - Locale & currency awareness for fetched projects
 */
export const useProjectStore = create<ProjectStore>()(
  devtools(
    (set, get) => ({
      projects: null,
      topProjects: null,
      isProjectsFetching: false,
      isProjectsError: false,
      showDonatableProjects: false,
      lastFetch: null,
      pendingFetch: null,
      selectedClassification: [],
      isSearching: false,
      debouncedSearchValue: '',

      fetchProjects: async (getApi , config) => {
        const { lastFetch, pendingFetch, projects: cached } = get();
        const requested: ProjectsFetchKey = {
          locale: String(config.queryParams?.locale ?? ''),
          currency: String(config.queryParams?.currency ?? ''),
          tenant: String(config.queryParams?.tenant ?? ''),
        };
        // The same request is already in flight.
        if (isSameFetchKey(pendingFetch, requested)) return;
        // This exact list is already held.
        if (isSameFetchKey(lastFetch, requested) && cached !== null) return;

        set(
          { isProjectsFetching: true, pendingFetch: requested },
          undefined,
          'projectStore/projects_fetch_start'
        );
        try {
          const projects = await getApi<MapProject[]>('/app/projects', config);

          // Superseded while in flight, so drop the response. Unlike `singleProjectStore`, nothing here throws after the success write, so comparing `pendingFetch` is enough on both settle paths.
          if (!isSameFetchKey(get().pendingFetch, requested)) return;

          set(
            {
              projects,
              topProjects: getTopProjects(projects),
              isProjectsFetching: false,
              lastFetch: requested,
              pendingFetch: null,
              isProjectsError: false,
            },
            undefined,
            'projectStore/projects_fetch_success'
          );
        } catch (error) {
          if (!isSameFetchKey(get().pendingFetch, requested)) return;

          set(
            {
              isProjectsFetching: false,
              isProjectsError: true,
              lastFetch: null,
              pendingFetch: null,
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

      clearFilterStates: () => {
        set(
          {
            debouncedSearchValue: '',
            selectedClassification: [],
            isSearching: false,
            showDonatableProjects: false,
          },
          undefined,
          'projectStore/clear_filter_states'
        );
      },
    }),
    {
      name: 'ProjectStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
