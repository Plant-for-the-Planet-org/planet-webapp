import type {
  APIError,
  CountryCode,
  CountryProject,
  CurrencyCode,
} from '@planet-sdk/common';
import type { BulkCodeMethods } from '../utils/constants/bulkCodeConstants';
import type { ApiConfigBase } from '../hooks/useApi';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useErrorHandlingStore } from './errorHandlingStore';
import { handleError } from '@planet-sdk/common';
import { filterEligibleProjects } from '../features/user/BulkCodes/utils';

export type ApiRequestFn = <T>(
  url: string,
  config?: ApiConfigBase
) => Promise<T>;

export interface PlanetCashAccount {
  guid: string;
  currency: CurrencyCode;
  country: CountryCode;
}

export interface Recipient {
  units: number;
  recipientName: string;
  recipientEmail: string;
  message: string;
  notifyRecipient: boolean;
  // occasion: string;
}

export interface BulkGiftImportData {
  comment?: string;
  occasion: string;
  recipients: Recipient[];
}

interface BulkCodeStore {
  bulkMethod: BulkCodeMethods | null;
  planetCashAccount: PlanetCashAccount | null;
  project: CountryProject | null;
  projectList: CountryProject[] | null;

  fetchProjectList: (getApi: ApiRequestFn) => Promise<void>;
  setBulkMethod: (bulkMethod: BulkCodeMethods | null) => void;
  setPlanetCashAccount: (planetCashAccount: PlanetCashAccount | null) => void;
  setProject: (project: CountryProject | null) => void;
}

export const useBulkCodeStore = create<BulkCodeStore>()(
  devtools(
    (set, get) => ({
      bulkMethod: null,
      bulkGiftData: null,
      planetCashAccount: null,
      project: null,
      projectList: null,

      fetchProjectList: async (getApi) => {
        const { planetCashAccount, projectList } = get();

        if (!planetCashAccount || projectList !== null) return;

        try {
          const fetchedProjects = await getApi<CountryProject[]>(
            `/app/countryProjects/${planetCashAccount.country}`
          );
          const filteredProjects = filterEligibleProjects(
            fetchedProjects,
            planetCashAccount.currency
          );

          if (filteredProjects.length > 0) {
            set({ projectList: filteredProjects });
          }
        } catch (error) {
          useErrorHandlingStore
            .getState()
            .setErrors(handleError(error as APIError));
        }
      },

      setProject: (project) => set({ project }),

      setBulkMethod: (bulkMethod) => set({ bulkMethod }),

      setPlanetCashAccount: (planetCashAccount) => set({ planetCashAccount }),
    }),
    {
      name: 'BulkCodeStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
