import type { APIError } from '@planet-sdk/common';
import type { ExtendedProject } from '../features/common/types/projectv2';
import type { ApiConfigBase } from '../hooks/useApi';
import type { NextRouter } from 'next/router';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getProjectTimeTravelConfig } from '../utils/mapsV2/timeTravel';
import { useProjectMapStore } from './projectMapStore';
import { useErrorHandlingStore } from './errorHandlingStore';
import { handleError, ClientError } from '@planet-sdk/common';
import { useInterventionStore } from './interventionStore';
import {
  buildProjectDetailsQuery,
  getSiteIdFromIndex,
} from '../utils/projectV2';
import { isSameFetchKey } from '../utils/fetchKey';

/**
 * Conditions a fetched project depends on. Includes the slug, since a session
 * moves between projects. See `src/utils/fetchKey.ts`.
 */
type SingleProjectFetchKey = {
  slug: string;
  locale: string;
  currency: string;
  tenant: string;
};

interface SingleProjectStore {
  singleProject: ExtendedProject | null;
  /**
   * Conditions of the last successful fetch. `null` when nothing has been
   * fetched yet, after a failure, or after `clearProjectStates`, so a failed
   * request can always be retried.
   */
  lastFetch: SingleProjectFetchKey | null;
  /** Conditions of the request in flight, `null` when idle. */
  pendingFetch: SingleProjectFetchKey | null;
  /**
   * Index of the currently selected site in `singleProject.sites`.
   * `null` indicates no site is selected.
   */
  selectedSite: number | null;

  isFetching: boolean;
  fetchError: boolean;
  /**
   * Fetches a single project and initializes related side effects.
   *
   * Side effects:
   * - Fetches interventions for tree projects
   * - Initializes map time-travel config for supported project types
   * - Forwards errors to the global error store
   */
  fetchProject: (
    getApi: <T>(url: string, config?: ApiConfigBase) => Promise<T>,
    config: ApiConfigBase,
    projectSlug: string
  ) => Promise<void>;

  // Use when only local state update is required (no routing)
  setSelectedSite: (siteIndex: number | null) => void;

  /**
   * Updates the project details route using shallow routing.
   * Keeps internal query params while exposing only visible params in the URL.
   */
  updateProjectDetailsPath: (
    locale: string,
    projectSlug: string,
    queryParams: Record<string, string>,
    router: NextRouter
  ) => void;
  updateUrlWithSiteId: (
    locale: string,
    projectSlug: string,
    siteId: string | null,
    router: NextRouter
  ) => void;

  /**
   * Selects a site by index and synchronizes the URL.
   *
   * - Clears intervention selection/hover state
   * - Updates the siteId query param via shallow routing
   * - Updates selectedSite state
   */
  // Use when site selection must be reflected in the URL
  selectSiteAndSyncUrl: (
    index: number | null,
    locale: string,
    router: NextRouter
  ) => void;

  clearProjectStates: () => void;
}

/**
 * SingleProjectStore
 *
 * Manages state for a single project including:
 * - Project data fetching
 * - Selected site state
 * - URL synchronization
 * - Side effects with map and intervention stores
 */

export const useSingleProjectStore = create<SingleProjectStore>()(
  devtools(
    (set, get) => ({
      singleProject: null,
      lastFetch: null,
      pendingFetch: null,
      selectedSite: null,

      // status flags
      isFetching: false,
      fetchError: false,

      fetchProject: async (getApi, config, projectSlug) => {
        const { lastFetch, pendingFetch, singleProject } = get();
        const requested: SingleProjectFetchKey = {
          slug: projectSlug,
          locale: String(config.queryParams?.locale ?? ''),
          currency: String(config.queryParams?.currency ?? ''),
          tenant: String(config.queryParams?.tenant ?? ''),
        };
        // Should this request start at all? An identical one is already running, so do not duplicate it.
        if (isSameFetchKey(pendingFetch, requested)) return;
        // This exact project is already held, so there is nothing to fetch. The key alone is not enough, the data has to be there too.
        if (isSameFetchKey(lastFetch, requested) && singleProject !== null)
          return;

        /**
         * Should this request's outcome be applied? Asked after each `await`, so unlike the guards above it is about writing to singleProject, not about starting the fetch.
         *
         * - `pendingFetch` matches: still the request in flight
         * - nothing pending and `lastFetch` matches: already wrote its own success and cleared its `pendingFetch`, and is now later in its own chain. Without this arm its own error would look superseded and be swallowed. The `null` check matters: a newer request can start during the time travel await, and this call must not write once it has
         */
        const isCurrent = () => {
          const state = get();
          return (
            isSameFetchKey(state.pendingFetch, requested) ||
            (state.pendingFetch === null &&
              isSameFetchKey(state.lastFetch, requested))
          );
        };

        set(
          { isFetching: true, fetchError: false, pendingFetch: requested },
          undefined,
          'singleProjectStore/project_fetch_start'
        );
        try {
          const project = await getApi<ExtendedProject>(
            `/app/projects/${projectSlug}`,
            config
          );

          // Superseded while in flight. Otherwise the last response to arrive wins over the last request to start, and the stale key it records then blocks its own correction.
          if (!isCurrent()) return;

          set(
            {
              singleProject: project,
              lastFetch: requested,
              pendingFetch: null,
              isFetching: false,
            },
            undefined,
            'singleProjectStore/project_fetch_success'
          );

          const { purpose, id: projectId } = project;

          if (projectId && purpose === 'trees') {
            useInterventionStore
              .getState()
              .fetchInterventions(getApi, projectId);
          }

          if (purpose === 'conservation' || purpose === 'trees') {
            const timeTravelConfig = await getProjectTimeTravelConfig(
              project.id,
              project.geoLocation
            );
            // Second await, so check again before writing to the map store.
            if (!isCurrent()) return;

            useProjectMapStore.getState().setTimeTravelConfig(timeTravelConfig);
          } else {
            throw new ClientError(404, {
              error_type: 'project_not_available',
              error_code: 'project_not_available',
            });
          }
        } catch (error) {
          // A superseded request must not raise an error or blank the project.
          if (!isCurrent()) return;

          useErrorHandlingStore
            .getState()
            .setErrors(handleError(error as APIError));
          set(
            {
              fetchError: true,
              isFetching: false,
              singleProject: null,
              // Reset so a retry is possible. The purpose check throws below the success write, so this key may already be recorded.
              lastFetch: null,
              pendingFetch: null,
            },
            undefined,
            'singleProjectStore/project_fetch_error'
          );
        }
      },

      setSelectedSite: (siteIndex) =>
        set(
          { selectedSite: siteIndex },
          undefined,
          'singleProjectStore/set_project_site'
        ),

      updateProjectDetailsPath: (
        locale,
        projectSlug,
        queryParams = {},
        router
      ) => {
        const displayPathname = `/${locale}/${projectSlug}`;
        // Extract only the visible query params for the URL
        const { locale: _, slug: __, p: ___, ...visibleParams } = queryParams;

        router?.push(
          {
            // Keep the actual route pattern here, not the tenant-facing
            // display path. Passing the display path instead corrupts
            // `router.pathname` after this shallow push (it no longer
            // matches '/sites/[slug]/[locale]/[p]'), which broke page
            // detection that relies on `router.pathname` (see useCurrentPage).
            pathname: router.pathname,
            query: queryParams,
          },
          // Only show necessary params in the URL
          `${displayPathname}${
            Object.keys(visibleParams).length
              ? '?' + new URLSearchParams(visibleParams).toString()
              : ''
          }`,
          { shallow: true }
        );
      },

      updateUrlWithSiteId: (locale, projectSlug, siteId, router) => {
        const { updateProjectDetailsPath } = get();
        const updatedQueryParams = buildProjectDetailsQuery(router.query, {
          siteId,
        });
        updateProjectDetailsPath(
          locale,
          projectSlug,
          updatedQueryParams,
          router
        );
      },

      selectSiteAndSyncUrl: (index, locale, router) => {
        const { singleProject, updateUrlWithSiteId } = get();
        if (!singleProject) return;

        useInterventionStore.getState().clearInterventionSelectionAndHover();

        const sites = singleProject.sites ?? [];
        const siteId = index !== null ? getSiteIdFromIndex(sites, index) : null;

        updateUrlWithSiteId(locale, singleProject.slug, siteId, router);

        set(
          { selectedSite: index },
          undefined,
          'singleProjectStore/select_site_and_sync_url'
        );
      },

      clearProjectStates: () =>
        set(
          {
            singleProject: null,
            lastFetch: null,
            pendingFetch: null,
            selectedSite: null,
            fetchError: false,
          },
          undefined,
          'singleProjectStore/clear_project_state'
        ),
    }),
    {
      name: 'SingleProjectStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
