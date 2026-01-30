import type {
  APIError,
  Intervention,
  SampleTreeRegistration,
} from '@planet-sdk/common';
import type { ExtendedProject } from '../features/common/types/projectv2';
import type { ApiConfigBase } from '../hooks/useApi';
import type { INTERVENTION_TYPE } from '../utils/constants/intervention';

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
  hoveredIntervention: Intervention | null;
  selectedInterventionType: INTERVENTION_TYPE;
  preventShallowPush: boolean;

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

  setSelectedSite: (sideIndex: number | null) => void;
  setSelectedSampleTree: (sampleTree: SampleTreeRegistration | null) => void;
  setSelectedIntervention: (intervention: Intervention | null) => void;
  setSelectedInterventionType: (interventionType: INTERVENTION_TYPE) => void;
  setHoveredIntervention: (intervention: Intervention | null) => void;
  setPreventShallowPush: (prevent: boolean) => void;
}

export const useInterventionStore = create<InterventionStore>()(
  devtools(
    (set, get) => ({
      singleProject: null,
      selectedSite: null,
      selectedSampleTree: null,
      interventions: null,
      selectedIntervention: null,
      hoveredIntervention: null,
      selectedInterventionType: 'all',
      preventShallowPush: false,

      // status flags
      isFetching: false,
      fetchError: false,

      fetchProject: async (getApi, config, projectSlug) => {
        set(
          { isFetching: true, fetchError: false },
          undefined,
          'interventionStore/project_fetch_start'
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
            'interventionStore/project_fetch_success'
          );

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
          set(
            {
              fetchError: true,
              isFetching: false,
              singleProject: null,
            },
            undefined,
            'interventionStore/project_fetch_error'
          );
        }
      },

      fetchInterventions: async (getApi, projectId) => {
        set(
          { isFetching: true, fetchError: false },
          undefined,
          'interventionStore/intervention_fetch_start'
        );
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
          set(
            { interventions, isFetching: false },
            undefined,
            'interventionStore/intervention_fetch_success'
          );
        } catch (error) {
          useErrorHandlingStore
            .getState()
            .setErrors(handleError(error as APIError));
          set(
            {
              fetchError: true,
              isFetching: false,
              interventions: null,
            },
            undefined,
            'interventionStore/intervention_fetch_error'
          );
        }
      },

      setSelectedSite: (siteIndex) =>
        set(
          { selectedSite: siteIndex },
          undefined,
          'interventionStore/set_project_site'
        ),

      setSelectedSampleTree: (sampleTree) =>
        set(
          { selectedSampleTree: sampleTree },
          undefined,
          'interventionStore/set_selected_sample_tree'
        ),

      setSelectedIntervention: (intervention) =>
        set(
          { selectedIntervention: intervention },
          undefined,
          'interventionStore/set_selected_intervention'
        ),

      setSelectedInterventionType: (intervention) =>
        set(
          { selectedInterventionType: intervention },
          undefined,
          'interventionStore/set_selected_intervention_type'
        ),

      setHoveredIntervention: (intervention) =>
        set(
          { selectedIntervention: intervention },
          undefined,
          'interventionStore/set_hovered_intervention'
        ),

      setPreventShallowPush: (prevent) =>
        set(
          { preventShallowPush: prevent },
          undefined,
          'interventionStore/set_prevent_shallow_push'
        ),
    }),
    {
      name: 'InterventionStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
