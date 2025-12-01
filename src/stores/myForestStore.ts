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
import {
  generateContributionsGeojson,
  transformResponse,
} from '../utils/myForestUtils';

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
  isContributionsLoaded: boolean;
  isLeaderboardLoaded: boolean;
  isProjectsListLoaded: boolean;
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

export const useMyForestStore = create<MyForestStore>((set, get) => ({
  //state
  userInfo: null,
  isPublicProfile: false,
  registrationGeojson: [],
  donationGeojson: [],
  isContributionsLoaded: false,
  isLeaderboardLoaded: false,
  isProjectsListLoaded: false,
  projectListResult: undefined,
  contributionsResult: undefined,
  leaderboardResult: undefined,

  //Actions
  setUserInfo: (userInfo) => set({ userInfo }),
  setIsPublicProfile: (isPublicProfile) => set({ isPublicProfile }),
  setRegistrationGeojson: (registrationGeojson) => set({ registrationGeojson }),
  setDonationGeojson: (donationGeojson) => set({ donationGeojson }),
  fetchMyForest: async (
    getApi: ApiRequestFn,
    getApiAuthenticated: ApiRequestFn
  ) => {
    const { userInfo, isPublicProfile } = get();
    if (!userInfo) return;

    set({
      isProjectsListLoaded: false,
      isContributionsLoaded: false,
      isLeaderboardLoaded: false,
    });

    try {
      const apiResponse =
        isPublicProfile && userInfo.slug
          ? await getApi<MyForestApiResponse>(`/app/myForest/${userInfo.slug}`)
          : await getApiAuthenticated<MyForestApiResponse>(`/app/myForest`);

      const transformedData = transformResponse(apiResponse);
      const { contributionsResult, projectListResult, leaderboardResult } =
        transformedData;

      const geojson =
        contributionsResult && projectListResult
          ? generateContributionsGeojson(contributionsResult, projectListResult)
          : { registrationGeojson: [], donationGeojson: [] };

      set({
        contributionsResult,
        projectListResult,
        leaderboardResult,
        registrationGeojson: geojson.registrationGeojson,
        donationGeojson: geojson.donationGeojson,
        isProjectsListLoaded: true,
        isContributionsLoaded: true,
        isLeaderboardLoaded: true,
      });
    } catch (error) {
      console.error('MyForest API error:', error);
      set({
        isProjectsListLoaded: false,
        isContributionsLoaded: false,
        isLeaderboardLoaded: false,
      });
    }
  },
}));
