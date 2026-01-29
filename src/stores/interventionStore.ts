import type {
  APIError,
  Intervention,
  SampleTreeRegistration,
} from '@planet-sdk/common';
import type { ExtendedProject } from '../features/common/types/projectv2';
import type { ApiConfigBase } from '../hooks/useApi';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useErrorHandlingStore } from './errorHandlingStore';
import { ClientError, handleError } from '@planet-sdk/common';
import { getProjectTimeTravelConfig } from '../utils/mapsV2/timeTravel';
import { useProjectMapStore } from './projectMapStore';

interface InterventionStore {
  singleProject: ExtendedProject | null;
  selectedSite: number | null;
  selectedSampleTree: SampleTreeRegistration | null;
  interventions: Intervention[] | null;
  selectedIntervention: Intervention | null;
  selectedInterventionType: 'all';

  isFetching: boolean;
  fetchError: boolean;

  fetchProject: (
    getApi: <T>(url: string, config?: ApiConfigBase) => Promise<T>,
    config: ApiConfigBase,
    projectSlug: string
  ) => Promise<void>;

  fetchInterventions: (
    getApi: <T>(url: string, config?: ApiConfigBase) => Promise<T>,
    projectId: string
  ) => Promise<void>;
}

export const useInterventionStore = create<InterventionStore>()(
  devtools(
    (set, get) => ({
      singleProject: null,
      selectedSite: null,
      selectedSampleTree: null,
      interventions: null,
      selectedIntervention: null,
      selectedInterventionType: 'all',

      // status flags
      isFetching: false,
      fetchError: false,

      fetchProject: async (getApi, config, projectSlug) => {
        set({ isFetching: true, fetchError: false });
        try {
          const project = await getApi<ExtendedProject>(
            `/app/projects/${projectSlug}`,
            config
          );

          set({
            singleProject: project,
            isFetching: false,
          });

          const { purpose, id: projectId } = project;

          if (projectId && purpose === 'trees') {
            const { fetchInterventions } = get();
            fetchInterventions(getApi, projectId);
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
          set({
            fetchError: true,
            isFetching: false,
            singleProject: null,
          });
        }
      },

      fetchInterventions: async (getApi, projectId) => {
        set({ isFetching: true, fetchError: false });
        try {
          const interventions = await getApi<Intervention[]>(
            `/app/interventions/${projectId}`,
            {
              queryParams: {
                // Fetches sampleInterventions within each intervention
                _scope: 'extended',
              },
            }
          );
          set({ interventions, isFetching: false });
        } catch (error) {
          useErrorHandlingStore
            .getState()
            .setErrors(handleError(error as APIError));
          set({
            fetchError: true,
            isFetching: false,
            interventions: null,
          });
        }
      },
    }),
    {
      name: 'InterventionStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
