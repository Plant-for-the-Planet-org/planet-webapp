import { useState, useEffect, useCallback, useRef } from 'react';
import { useApi } from './useApi';
import type {
  ProjectListResponse,
  ContributionsResponse,
  Leaderboard,
} from '../features/common/types/myForest';

interface MyForestApiResponse {
  stats: ContributionsResponse['stats'];
  myContributionsMap: ContributionsResponse['myContributionsMap'];
  registrationLocationsMap: ContributionsResponse['registrationLocationsMap'];
  projectLocationsMap: ContributionsResponse['projectLocationsMap'];
  leaderboard: Leaderboard;
  projects: ProjectListResponse;
}

interface UseMyForestApiResult {
  data: {
    projectListResult?: ProjectListResponse;
    contributionsResult?: ContributionsResponse;
    leaderboardResult?: Leaderboard;
  };
  loading: {
    isProjectsListLoaded: boolean;
    isContributionsLoaded: boolean;
    isLeaderboardLoaded: boolean;
  };
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseMyForestApiOptions {
  profileGuidOrSlug?: string;
  isPublicProfile: boolean;
  enabled: boolean;
}

export const useMyForestApi = ({
  profileGuidOrSlug,
  isPublicProfile,
  enabled,
}: UseMyForestApiOptions): UseMyForestApiResult => {
  const { getApiAuthenticated, getApi } = useApi();
  const [data, setData] = useState<UseMyForestApiResult['data']>({});
  const [loading, setLoading] = useState({
    isProjectsListLoaded: false,
    isContributionsLoaded: false,
    isLeaderboardLoaded: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Track if we've already made a request for this combination to prevent duplicates
  const lastRequestRef = useRef<string>('');

  const transformResponse = (
    response: MyForestApiResponse
  ): UseMyForestApiResult['data'] => {
    // Ensure response exists and has required properties
    if (!response) {
      return {
        projectListResult: {},
        contributionsResult: {
          stats: {
            giftsReceivedCount: 0,
            contributionsMadeCount: 0,
            treesRegistered: 0,
            treesDonated: { personal: 0, received: 0 },
            areaRestoredInM2: { personal: 0, received: 0 },
            areaConservedInM2: { personal: 0, received: 0 },
          },
          myContributionsMap: new Map(),
          registrationLocationsMap: new Map(),
          projectLocationsMap: new Map(),
        },
        leaderboardResult: { mostRecent: [], mostTrees: [] },
      };
    }

    // Convert projects array to Map if needed (depending on API response format)
    let projects = response.projects || {};
    if (Array.isArray(response.projects)) {
      const projectsMap: ProjectListResponse = {};
      response.projects.forEach((project: any) => {
        if (project && project.guid) {
          projectsMap[project.guid] = project;
        }
      });
      projects = projectsMap;
    }

    // Convert myContributionsMap array to Map if it comes as array from API
    let myContributionsMap = response.myContributionsMap || new Map();
    if (Array.isArray(response.myContributionsMap)) {
      const contributionsMap = new Map();
      response.myContributionsMap.forEach(([key, value]: [string, any]) => {
        if (key && value) {
          contributionsMap.set(key, value);
        }
      });
      myContributionsMap = contributionsMap;
    }

    // Convert location maps if they come as arrays from API
    let registrationLocationsMap =
      response.registrationLocationsMap || new Map();
    if (Array.isArray(response.registrationLocationsMap)) {
      const registrationMap = new Map();
      response.registrationLocationsMap.forEach(
        ([key, value]: [string, any]) => {
          if (key && value) {
            registrationMap.set(key, value);
          }
        }
      );
      registrationLocationsMap = registrationMap;
    }

    let projectLocationsMap = response.projectLocationsMap || new Map();
    if (Array.isArray(response.projectLocationsMap)) {
      const projectMap = new Map();
      response.projectLocationsMap.forEach(([key, value]: [string, any]) => {
        if (key && value) {
          projectMap.set(key, value);
        }
      });
      projectLocationsMap = projectMap;
    }

    // Transform the combined response into the expected format
    const stats = {
      giftsReceivedCount: response.stats?.giftsReceivedCount || 0,
      contributionsMadeCount: response.stats?.contributionsMadeCount || 0,
      treesRegistered: response.stats?.treesRegistered || 0,
      treesDonated: response.stats?.treesDonated || {
        personal: 0,
        received: 0,
      },
      areaRestoredInM2: response.stats?.areaRestoredInM2 || {
        personal: 0,
        received: 0,
      },
      areaConservedInM2: response.stats?.areaConservedInM2 || {
        personal: 0,
        received: 0,
      },
    };

    const contributionsResult: ContributionsResponse = {
      stats,
      myContributionsMap,
      registrationLocationsMap,
      projectLocationsMap,
    };

    return {
      projectListResult: projects,
      contributionsResult,
      leaderboardResult: response.leaderboard || {
        mostRecent: [],
        mostTrees: [],
      },
    };
  };

  // Create a stable refetch function
  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setError(null);
      setLoading({
        isProjectsListLoaded: false,
        isContributionsLoaded: false,
        isLeaderboardLoaded: false,
      });

      let apiResponse: any;

      if (isPublicProfile && profileGuidOrSlug) {
        apiResponse = await getApi<any>(`/app/myForest/${profileGuidOrSlug}`);
      } else {
        apiResponse = await getApiAuthenticated<any>('/app/myForest');
      }

      // The server should return data directly (not wrapped in result.data.json)
      const response: MyForestApiResponse = apiResponse;
      const transformedData = transformResponse(response);
      setData(transformedData);

      setLoading({
        isProjectsListLoaded: true,
        isContributionsLoaded: true,
        isLeaderboardLoaded: true,
      });
    } catch (err) {
      console.error('MyForest API error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');

      // Set empty data on error to prevent undefined issues
      const emptyData = transformResponse(null as any);
      setData(emptyData);

      setLoading({
        isProjectsListLoaded: false,
        isContributionsLoaded: false,
        isLeaderboardLoaded: false,
      });
    }
  }, [
    enabled,
    isPublicProfile,
    profileGuidOrSlug,
    getApiAuthenticated,
    getApi,
  ]);

  // Only fetch when the request parameters actually change
  useEffect(() => {
    if (!enabled) return;

    // Create a unique key for this request
    const requestKey = `${enabled}-${isPublicProfile}-${
      profileGuidOrSlug || 'private'
    }`;

    // Only make the request if it's different from the last one
    if (lastRequestRef.current !== requestKey) {
      lastRequestRef.current = requestKey;
      refetch();
    }
  }, [enabled, isPublicProfile, profileGuidOrSlug, refetch]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
