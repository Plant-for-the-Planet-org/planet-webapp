import type { APIError, SampleTreeRegistration } from '@planet-sdk/common';
import type { ExtendedProject } from '../features/common/types/projectv2';
import type { ApiConfigBase } from '../hooks/useApi';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getProjectTimeTravelConfig } from '../utils/mapsV2/timeTravel';
import { useProjectMapStore } from './projectMapStore';
import { useErrorHandlingStore } from './errorHandlingStore';
import { handleError, ClientError } from '@planet-sdk/common';
import { useInterventionStore } from './interventionStore';

interface SingleProjectStore {
  singleProject: ExtendedProject | null;
  selectedSite: number | null;
  selectedSampleTree: SampleTreeRegistration | null;
  preventShallowPush: boolean;

  isFetching: boolean;
  fetchError: boolean;

  fetchProject: (
    getApi: <T>(url: string, config?: ApiConfigBase) => Promise<T>,
    config: ApiConfigBase,
    projectSlug: string
  ) => Promise<void>;

  setSelectedSite: (sideIndex: number | null) => void;
  setSelectedSampleTree: (sampleTree: SampleTreeRegistration | null) => void;
  setPreventShallowPush: (prevent: boolean) => void;

  clearProjectStates: () => void;
}

export const useSingleProjectStore = create<SingleProjectStore>()(
  devtools(
    (set) => ({
      singleProject: null,
      selectedSite: null,
      selectedSampleTree: null,
      preventShallowPush: false,

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

      setSelectedSampleTree: (sampleTree) =>
        set(
          { selectedSampleTree: sampleTree },
          undefined,
          'singleProjectStore/set_selected_sample_tree'
        ),

      setPreventShallowPush: (prevent) =>
        set(
          { preventShallowPush: prevent },
          undefined,
          'singleProjectStore/set_prevent_shallow_push'
        ),

      clearProjectStates: () =>
        set(
          {
            singleProject: null,
            selectedSampleTree: null,
            selectedSite: null,
            preventShallowPush: false,
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
