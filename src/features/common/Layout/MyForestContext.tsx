import type { ReactNode } from 'react';
import type {
  ProjectListResponse,
  MyForestProject,
  ContributionsResponse,
  MyContributionsSingleRegistration,
  MyContributionsSingleProject,
  MapLocation,
  MyContributionsMapItem,
  Leaderboard,
  DonationProperties,
  ContributionStats,
} from '../types/myForest';
import type { SetState } from '../types/common';
import type { PointFeature } from 'supercluster';

import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useMyForestApi } from '../../../hooks/useMyForestApi';
import { ErrorHandlingContext } from './ErrorHandlingContext';

interface UserInfo {
  profileId: string;
  slug: string;
  targets: {
    treesDonated: number;
    areaRestored: number;
    areaConserved: number;
  };
}
type RefetchFunction = () => Promise<void>;

interface MyForestContextInterface {
  projectListResult: ProjectListResponse | undefined;
  contributionsResult: ContributionsResponse | undefined;
  leaderboardResult: Leaderboard | undefined;
  isLeaderboardLoaded: boolean;
  isProjectsListLoaded: boolean;
  isContributionsLoaded: boolean;
  contributionsMap: Map<string, MyContributionsMapItem> | undefined;
  registrationGeojson: PointFeature<MyContributionsSingleRegistration>[];
  donationGeojson: PointFeature<DonationProperties>[];
  userInfo: UserInfo | null;
  setUserInfo: SetState<UserInfo | null>;
  contributionStats: ContributionStats | undefined;
  isPublicProfile: boolean;
  setIsPublicProfile: SetState<boolean>;
  refetchContributions: RefetchFunction;
  refetchLeaderboard: RefetchFunction;
}

const MyForestContext = createContext<MyForestContextInterface | null>(null);

export const MyForestProvider = ({ children }: { children: ReactNode }) => {
  const { setErrors } = useContext(ErrorHandlingContext);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [contributionsMap, setContributionsMap] =
    useState<Map<string, MyContributionsMapItem>>();
  const [contributionStats, setContributionStats] =
    useState<ContributionStats>();
  const [registrationGeojson, setRegistrationGeojson] = useState<
    PointFeature<MyContributionsSingleRegistration>[]
  >([]);

  const [donationGeojson, setDonationGeojson] = useState<
    PointFeature<DonationProperties>[]
  >([]);

  const [isPublicProfile, setIsPublicProfile] = useState(false);

  // Use the new API hook
  const {
    data: { projectListResult, contributionsResult, leaderboardResult },
    loading: { isProjectsListLoaded, isContributionsLoaded, isLeaderboardLoaded },
    error: apiError,
    refetch,
  } = useMyForestApi({
    profileGuidOrSlug: isPublicProfile ? userInfo?.slug : undefined,
    isPublicProfile,
    enabled: !!userInfo?.profileId && !!userInfo?.slug,
  });

  // Handle API errors
  useEffect(() => {
    if (apiError) {
      setErrors([{ message: apiError }]);
    }
  }, [apiError, setErrors]);

  //format geojson
  const _generateDonationGeojson = (
    project: MyForestProject,
    contributionsForProject: MyContributionsSingleProject
  ) => {
    return {
      type: 'Feature',
      geometry: project.geometry,
      properties: {
        projectInfo: project,
        contributionInfo: contributionsForProject,
      },
    } as PointFeature<DonationProperties>;
  };

  const _generateRegistrationGeojson = (
    registrationLocation: MapLocation,
    registration: MyContributionsSingleRegistration
  ) => {
    return {
      type: 'Feature',
      geometry: registrationLocation.geometry,
      properties: registration,
    } as PointFeature<MyContributionsSingleRegistration>;
  };

  useEffect(() => {
    if (contributionsResult && contributionsResult.myContributionsMap) {
      const _registrationGeojson: PointFeature<MyContributionsSingleRegistration>[] =
        [];
      const _donationGeojson: PointFeature<DonationProperties>[] = [];

      setContributionsMap(contributionsResult.myContributionsMap);
      setContributionStats(contributionsResult.stats);
      
      // Ensure myContributionsMap is a Map and has forEach method
      if (contributionsResult.myContributionsMap instanceof Map) {
        //iterate through contributionsMap and generate geojson for each contribution
        contributionsResult.myContributionsMap.forEach((item, key) => {
          if (item.type === 'project') {
            // add to donation Geojson
            if (projectListResult && projectListResult[key]) {
              const geojson = _generateDonationGeojson(
                projectListResult[key],
                item
              );
              _donationGeojson.push(geojson);
            }
          } else {
            // add to registration Geojson
            const registrationLocation =
              contributionsResult.registrationLocationsMap?.get(key);
            if (registrationLocation) {
              const geojson = _generateRegistrationGeojson(
                registrationLocation,
                item
              );
              _registrationGeojson.push(geojson);
            }
          }
        });
      }

      if (_registrationGeojson.length > 0)
        setRegistrationGeojson(_registrationGeojson);

      if (_donationGeojson.length > 0) setDonationGeojson(_donationGeojson);
    }
  }, [contributionsResult, projectListResult]);

  const value = useMemo(
    () => ({
      projectListResult,
      contributionsResult,
      leaderboardResult,
      isLeaderboardLoaded,
      isProjectsListLoaded,
      isContributionsLoaded,
      contributionsMap,
      registrationGeojson,
      donationGeojson,
      userInfo,
      setUserInfo,
      contributionStats,
      isPublicProfile,
      setIsPublicProfile,
      refetchContributions: refetch,
      refetchLeaderboard: refetch,
    }),
    [
      projectListResult,
      contributionsResult,
      leaderboardResult,
      isLeaderboardLoaded,
      isProjectsListLoaded,
      isContributionsLoaded,
      contributionsMap,
      registrationGeojson,
      donationGeojson,
      userInfo,
      setUserInfo,
      contributionStats,
      isPublicProfile,
      refetch,
    ]
  );

  return (
    <MyForestContext.Provider value={value}>
      {children}
    </MyForestContext.Provider>
  );
};

export const useMyForest = () => {
  const context = useContext(MyForestContext);
  if (!context) {
    throw new Error('MyForestContext must be used within MyForestProvider');
  }
  return context;
};
