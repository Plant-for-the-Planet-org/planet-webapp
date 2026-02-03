import type { PointFeature } from 'supercluster';
import type {
  ContributionsResponse,
  DonationProperties,
  Leaderboard,
  MyContributionsSingleRegistration,
  ProjectListResponse,
} from '../features/common/types/myForest';
import type { ApiConfigBase } from '../hooks/useApi';
import type { APIError } from '@planet-sdk/common';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  generateContributionsGeojson,
  transformResponse,
} from '../utils/myForestUtils';
import { handleError } from '@planet-sdk/common';
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
      setUserInfo: (userInfo) =>
        set({ userInfo }, undefined, 'myForest/set_user_info'),

      setIsPublicProfile: (isPublicProfile) =>
        set({ isPublicProfile }, undefined, 'myForest/set_is_public_profile'),

      fetchMyForest: async (getApi, getApiAuthenticated) => {
        const { userInfo, isPublicProfile } = get();
        if (!userInfo) return;

        set({ isMyForestLoading: true }, undefined, 'myForest/fetch_start');

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
            'myForest/fetch_success'
          );
        } catch (error) {
          useErrorHandlingStore
            .getState()
            .setErrors(handleError(error as APIError));
          console.error('MyForest API error:', error);
          set(
            {
              isMyForestLoading: false,
            },
            undefined,
            'myForest/fetch_error'
          );
        }
      },

      resetMyForestStore: () =>
        set(initialState, undefined, 'myForest/reset_store'),
    }),
    {
      name: 'MyForestStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
