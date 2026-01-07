import type { PointFeature } from 'supercluster';
import type {
  ContributionsResponse,
  DonationProperties,
  Leaderboard,
  MyContributionsSingleRegistration,
  ProjectListResponse,
} from '../features/common/types/myForest';
import type { ApiConfigBase } from '../hooks/useApi';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  generateContributionsGeojson,
  transformResponse,
} from '../utils/myForestUtils';
import { APIError } from '@planet-sdk/common';
import { useErrorHandlingStore } from './errorHandlingStore';

interface UserInfo {
  profileId: string;
  slug: string;
  targets: {
    treesDonated: number;
    areaRestored: number;
    areaConserved: number;
  };
}
export type ApiRequestFn = <T>(
  url: string,
  config?: ApiConfigBase
) => Promise<T>;

interface MyForestApiResponse {
  stats: ContributionsResponse['stats'];
  myContributionsMap: ContributionsResponse['myContributionsMap'];
  registrationLocationsMap: ContributionsResponse['registrationLocationsMap'];
  projectLocationsMap: ContributionsResponse['projectLocationsMap'];
  leaderboard: Leaderboard;
  projects: ProjectListResponse;
}
interface MyForestStore {
  // State
  userInfo: UserInfo | null;
  registrationGeojson: PointFeature<MyContributionsSingleRegistration>[];
  donationGeojson: PointFeature<DonationProperties>[];
  isPublicProfile: boolean;
  isMyForestLoading: boolean;
  projectListResult: ProjectListResponse | undefined;
  contributionsResult: ContributionsResponse | undefined;
  leaderboardResult: Leaderboard | undefined;

  // Actions
  setUserInfo: (userInfo: UserInfo | null) => void;
  setIsPublicProfile: (isPublic: boolean) => void;
  fetchMyForest: (
    getApi: ApiRequestFn,
    getApiAuthenticated: ApiRequestFn
  ) => Promise<void>;
  resetMyForestStore: () => void;
}

const initialState = {
  userInfo: null,
  isPublicProfile: false,
  registrationGeojson: [],
  donationGeojson: [],
  isMyForestLoading: true,
  projectListResult: undefined,
  contributionsResult: undefined,
  leaderboardResult: undefined,
};

export const useMyForestStore = create<MyForestStore>()(
  devtools(
    (set, get) => ({
      //state
      ...initialState,

      //Actions
      setUserInfo: (userInfo) => set({ userInfo }, undefined, 'setUserInfo'),

      setIsPublicProfile: (isPublicProfile) =>
        set({ isPublicProfile }, undefined, 'setIsPublicProfile'),

      fetchMyForest: async (getApi, getApiAuthenticated) => {
        const { userInfo, isPublicProfile } = get();
        if (!userInfo) return;

        const { setErrors } = useErrorHandlingStore.getState();

        set({ isMyForestLoading: true }, undefined, 'fetchMyForest_start');

        try {
          const apiResponse =
            isPublicProfile && userInfo.slug
              ? await getApi<MyForestApiResponse>(
                  `/app/myForest/${userInfo.slug}`
                )
              : await getApiAuthenticated<MyForestApiResponse>(`/app/myForest`);

          const transformedData = transformResponse(apiResponse);
          const { contributionsResult, projectListResult } = transformedData;

          const geojson =
            contributionsResult && projectListResult
              ? generateContributionsGeojson(
                  contributionsResult,
                  projectListResult
                )
              : { registrationGeojson: [], donationGeojson: [] };

          set(
            {
              ...transformedData,
              ...geojson,
              isMyForestLoading: false,
            },
            undefined,
            'fetchMyForest_success'
          );
          setErrors(null);
        } catch (error) {
          const errorMessage =
            error instanceof APIError ? error.message : 'Something went wrong';
          console.error('MyForest API error:', error);
          set(
            {
              isMyForestLoading: false,
            },
            undefined,
            'fetchMyForest_error'
          );
          setErrors(errorMessage);
        }
      },

      resetMyForestStore: () =>
        set(initialState, undefined, 'resetMyForestState'),
    }),
    {
      name: 'MyForestStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
