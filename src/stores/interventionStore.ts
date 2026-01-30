import type { APIError, Intervention } from '@planet-sdk/common';
import type { ApiConfigBase } from '../hooks/useApi';
import type { INTERVENTION_TYPE } from '../utils/constants/intervention';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useErrorHandlingStore } from './errorHandlingStore';
import { handleError } from '@planet-sdk/common';

interface InterventionStore {
  interventions: Intervention[] | null;
  selectedIntervention: Intervention | null;
  hoveredIntervention: Intervention | null;
  selectedInterventionType: INTERVENTION_TYPE;

  isFetching: boolean;
  fetchError: boolean;

  fetchInterventions: (
    getApi: <T>(url: string, config?: ApiConfigBase) => Promise<T>,
    projectId: string
  ) => Promise<void>;

  setInterventions: (interventions: Intervention[] | null) => void;
  setSelectedIntervention: (intervention: Intervention | null) => void;
  setSelectedInterventionType: (interventionType: INTERVENTION_TYPE) => void;
  setHoveredIntervention: (intervention: Intervention | null) => void;

  clearInterventionStates: () => void;
  clearMapLayerInteractionStates: () => void;
}

export const useInterventionStore = create<InterventionStore>()(
  devtools(
    (set) => ({
      interventions: null,
      selectedIntervention: null,
      hoveredIntervention: null,
      selectedInterventionType: 'all',

      // status flags
      isFetching: false,
      fetchError: false,

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

      setInterventions: (interventions) => set({ interventions }),

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

      clearInterventionStates: () =>
        set(
          {
            selectedIntervention: null,
            hoveredIntervention: null,
            selectedInterventionType: 'all',
            interventions: null,
          },
          undefined,
          'interventionStore/clear_intervention_state'
        ),

      clearMapLayerInteractionStates: () =>
        set(
          {
            selectedIntervention: null,
            hoveredIntervention: null,
          },
          undefined,
          'interventionStore/clear_map_layer_interaction_states'
        ),
    }),
    {
      name: 'InterventionStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
