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
  //TODO: Remove once error handling is fully migrated from useContext to Zustand
  errorMessage: string | null;
  projectListResult: ProjectListResponse | undefined;
  contributionsResult: ContributionsResponse | undefined;
  leaderboardResult: Leaderboard | undefined;

  // Actions
  setUserInfo: (userInfo: UserInfo | null) => void;
  setIsPublicProfile: (isPublic: boolean) => void;
  setRegistrationGeojson: (
    geojson: PointFeature<MyContributionsSingleRegistration>[]
  ) => void;
  setDonationGeojson: (geojson: PointFeature<DonationProperties>[]) => void;
  fetchMyForest: (
    getApi: ApiRequestFn,
    getApiAuthenticated: ApiRequestFn
  ) => Promise<void>;
}

export const useMyForestStore = create<MyForestStore>()(
  devtools(
    (set, get) => ({
      //state
      userInfo: null,
      isPublicProfile: false,
      registrationGeojson: [],
      donationGeojson: [],
      isMyForestLoading: false,
      errorMessage: null,
      projectListResult: undefined,
      contributionsResult: undefined,
      leaderboardResult: undefined,

      //Actions
      setUserInfo: (userInfo) => set({ userInfo }, undefined, 'setUserInfo'),

      setIsPublicProfile: (isPublicProfile) =>
        set({ isPublicProfile }, undefined, 'setIsPublicProfile'),

      setRegistrationGeojson: (registrationGeojson) =>
        set({ registrationGeojson }, undefined, 'setRegistrationGeojson'),

      setDonationGeojson: (donationGeojson) =>
        set({ donationGeojson }, undefined, 'setDonationGeojson'),

      fetchMyForest: async (getApi, getApiAuthenticated) => {
        const { userInfo, isPublicProfile } = get();
        if (!userInfo) return;

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
              errorMessage: null,
            },
            undefined,
            'fetchMyForest_success'
          );
        } catch (error) {
          const errorMessage =
            error instanceof APIError ? error.message : 'Something went wrong';
          console.error('MyForest API error:', error);
          set(
            {
              isMyForestLoading: false,
              errorMessage,
            },
            undefined,
            'fetchMyForest_error'
          );
        }
      },
    }),
    {
      name: 'MyForestStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
