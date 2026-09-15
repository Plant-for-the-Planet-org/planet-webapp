import type { APIError, CountryProject } from '@planet-sdk/common';
import type { BulkCodesPlanetCashAccount } from '../features/user/BulkCodes/BulkCodesTypes';
import type { BulkCodeMethods } from '../utils/constants/bulkCodeConstants';
import type { ApiRequestFn } from '../hooks/useApi';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useErrorHandlingStore } from './errorHandlingStore';
import { handleError } from '@planet-sdk/common';
import { filterEligibleProjects } from '../features/user/BulkCodes/utils';

interface BulkCodeStore {
  bulkMethod: BulkCodeMethods | null;
  planetCashAccount: BulkCodesPlanetCashAccount | null;
  project: CountryProject | null;
  projectList: CountryProject[] | null;
  isFetchingProjectList: boolean;

  fetchProjectList: (getApi: ApiRequestFn) => Promise<void>;
  setBulkMethod: (bulkMethod: BulkCodeMethods | null) => void;
  setPlanetCashAccount: (
    planetCashAccount: BulkCodesPlanetCashAccount | null
  ) => void;
  setProject: (project: CountryProject | null) => void;
  resetBulkCodeStore: () => void;
}

const initialState = {
  bulkMethod: null,
  planetCashAccount: null,
  project: null,
  projectList: null,
  isFetchingProjectList: false,
};

export const useBulkCodeStore = create<BulkCodeStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchProjectList: async (getApi) => {
        const { planetCashAccount, projectList, isFetchingProjectList } =
          get();

        if (
          !planetCashAccount ||
          projectList !== null ||
          isFetchingProjectList
        )
          return;

        // The store resets on profile change (see useInitializeBulkCode),
        // independent of this call. Comparing against the account this
        // request was made for - rather than a monotonic counter - catches
        // both a profile switch mid-request and a later request for a
        // different account, so a stale response can't land in the wrong
        // profile's store.
        const requestedAccountGuid = planetCashAccount.guid;
        const isStale = () =>
          get().planetCashAccount?.guid !== requestedAccountGuid;

        set(
          { isFetchingProjectList: true },
          undefined,
          'bulkCode/fetch_project_list_start'
        );
        try {
          const fetchedProjects = await getApi<CountryProject[]>(
            `/app/countryProjects/${planetCashAccount.country}`
          );
          const filteredProjects = filterEligibleProjects(
            fetchedProjects,
            planetCashAccount.currency
          );

          if (isStale()) return;

          set(
            { projectList: filteredProjects },
            undefined,
            'bulkCode/fetch_project_list_success'
          );
        } catch (error) {
          if (!isStale()) {
            useErrorHandlingStore
              .getState()
              .setErrors(handleError(error as APIError));
          }
        } finally {
          if (!isStale()) {
            set(
              { isFetchingProjectList: false },
              undefined,
              'bulkCode/fetch_project_list_complete'
            );
          }
        }
      },

      setProject: (project) =>
        set({ project }, undefined, 'bulkCode/set_project'),

      setBulkMethod: (bulkMethod) =>
        set({ bulkMethod }, undefined, 'bulkCode/set_bulk_method'),

      setPlanetCashAccount: (planetCashAccount) =>
        set(
          { planetCashAccount },
          undefined,
          'bulkCode/set_planet_cash_account'
        ),

      resetBulkCodeStore: () =>
        set(initialState, undefined, 'bulkCode/reset_store'),
    }),
    {
      name: 'BulkCodeStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
