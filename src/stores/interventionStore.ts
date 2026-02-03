import type {
  APIError,
  Intervention,
  SampleTreeRegistration,
} from '@planet-sdk/common';
import type { ApiConfigBase } from '../hooks/useApi';
import type { INTERVENTION_TYPE } from '../utils/constants/intervention';
import type { NextRouter } from 'next/router';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useErrorHandlingStore } from './errorHandlingStore';
import { handleError } from '@planet-sdk/common';
import { buildProjectDetailsQuery } from '../utils/projectV2';
import { useSingleProjectStore } from './singleProjectStore';

interface InterventionStore {
  interventions: Intervention[] | null;
  selectedIntervention: Intervention | null;
  selectedSampleIntervention: SampleTreeRegistration | null;
  hoveredIntervention: Intervention | null;
  selectedInterventionType: INTERVENTION_TYPE;

  isFetching: boolean;
  fetchError: boolean;

  fetchInterventions: (
    getApi: <T>(url: string, config?: ApiConfigBase) => Promise<T>,
    projectId: string
  ) => Promise<void>;

  setSelectedIntervention: (intervention: Intervention | null) => void;
  setSelectedSampleIntervention: (
    sampleIntervention: SampleTreeRegistration | null
  ) => void;
  setSelectedInterventionType: (interventionType: INTERVENTION_TYPE) => void;
  setHoveredIntervention: (intervention: Intervention | null) => void;

  selectInterventionSyncUrl: (
    intervention: Intervention,
    locale: string,
    projectSlug: string,
    router: NextRouter
  ) => void;

  clearInterventionStates: () => void;
  clearInterventionSelectionAndHover: () => void;
}

export const useInterventionStore = create<InterventionStore>()(
  devtools(
    (set) => ({
      interventions: null,
      selectedIntervention: null,
      selectedSampleIntervention: null,
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

      setSelectedIntervention: (intervention) =>
        set(
          { selectedIntervention: intervention },
          undefined,
          'interventionStore/set_selected_intervention'
        ),

      setSelectedSampleIntervention: (sampleIntervention) =>
        set(
          { selectedSampleIntervention: sampleIntervention },
          undefined,
          'interventionStore/set_selected_sample_intervention'
        ),

      setSelectedInterventionType: (intervention) =>
        set(
          { selectedInterventionType: intervention },
          undefined,
          'interventionStore/set_selected_intervention_type'
        ),

      setHoveredIntervention: (intervention) =>
        set(
          { hoveredIntervention: intervention },
          undefined,
          'interventionStore/set_hovered_intervention'
        ),

      clearInterventionStates: () =>
        set(
          {
            selectedIntervention: null,
            selectedSampleIntervention: null,
            hoveredIntervention: null,
            selectedInterventionType: 'all',
            interventions: null,
          },
          undefined,
          'interventionStore/clear_intervention_states'
        ),

      clearInterventionSelectionAndHover: () =>
        set(
          {
            selectedIntervention: null,
            hoveredIntervention: null,
            selectedSampleIntervention: null,
          },
          undefined,
          'interventionStore/clear_selected_hovered_intervention'
        ),

      selectInterventionSyncUrl: (
        intervention,
        locale,
        projectSlug,
        router
      ) => {
        const { setSelectedSite, updateProjectDetailsPath } =
          useSingleProjectStore.getState();
        setSelectedSite(null);

        set({ selectedIntervention: intervention });

        const updatedQueryParams = buildProjectDetailsQuery(router.query, {
          plocId: intervention.hid,
        });

        updateProjectDetailsPath(
          locale,
          projectSlug,
          updatedQueryParams,
          router
        );
      },
    }),
    {
      name: 'InterventionStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
