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

interface SingleProjectStore {
  singleProject: ExtendedProject | null;
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
  setSelectedSite: (sideIndex: number | null) => void;

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
      selectedSite: null,

      // status flags
      isFetching: false,
      fetchError: false,

      fetchProject: async (getApi, config, projectSlug) => {
        set(
          { isFetching: true, fetchError: false },
          undefined,
          'singleProjectStore/project_fetch_start'
        );
        try {
          const project = await getApi<ExtendedProject>(
            `/app/projects/${projectSlug}`,
            config
          );

          set(
            {
              singleProject: project,
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
            useProjectMapStore.getState().setTimeTravelConfig(timeTravelConfig);
          } else {
            throw new ClientError(404, {
              error_type: 'project_not_available',
              error_code: 'project_not_available',
            });
          }
        } catch (error) {
          useErrorHandlingStore
            .getState()
            .setErrors(handleError(error as APIError));
          set(
            {
              fetchError: true,
              isFetching: false,
              singleProject: null,
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
        const pathname = `/${locale}/${projectSlug}`;
        // Extract only the visible query params for the URL
        const { locale: _, slug: __, p: ___, ...visibleParams } = queryParams;

        router?.push(
          {
            pathname,
            query: queryParams,
          },
          // Only show necessary params in the URL
          `${pathname}${
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
        useInterventionStore.getState().clearInterventionSelectionAndHover();

        const { singleProject, updateUrlWithSiteId } = get();

        if (!singleProject) return;

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
            selectedSite: null,
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
