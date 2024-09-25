import {
  FC,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { trpc } from '../../../utils/trpc';
import { ErrorHandlingContext } from './ErrorHandlingContext';
import {
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
import { updateStateWithTrpcData } from '../../../utils/trpcHelpers';
import { SetState } from '../types/common';
import { PointFeature } from 'supercluster';

interface UserInfo {
  profileId: string;
  slug: string;
  targets: {
    treesDonated: number;
    areaRestored: number;
    areaConserved: number;
  };
}
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
}

const MyForestContext = createContext<MyForestContextInterface | null>(null);

export const MyForestProvider: FC = ({ children }) => {
  const { setErrors } = useContext(ErrorHandlingContext);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [projectListResult, setProjectListResult] =
    useState<ProjectListResponse>();
  const [contributionsResult, setContributionsResult] =
    useState<ContributionsResponse>();
  const [leaderboardResult, setLeaderboardResult] = useState<Leaderboard>();
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

  const _projectList = trpc.myForest.projectList.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const _contributions = trpc.myForest.contributions.useQuery(
    {
      profileId: `${userInfo?.profileId}`,
    },
    {
      enabled: !!userInfo?.profileId && !!userInfo?.slug,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  const _leaderboard = trpc.myForest.leaderboard.useQuery(
    {
      profileId: `${userInfo?.profileId}`,
    },
    {
      enabled: !!userInfo?.profileId && !!userInfo?.slug,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  useEffect(() => {
    if (_projectList.data) {
      updateStateWithTrpcData(_projectList, setProjectListResult, setErrors);
    }
  }, [_projectList.data, _projectList.error]);

  useEffect(() => {
    if (_contributions.data) {
      updateStateWithTrpcData(
        _contributions,
        setContributionsResult,
        setErrors
      );
    }
  }, [_contributions.data, _contributions.error]);

  useEffect(() => {
    if (_leaderboard.data) {
      updateStateWithTrpcData(_leaderboard, setLeaderboardResult, setErrors);
    }
  }, [_leaderboard?.data, _leaderboard?.error]);

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
    if (contributionsResult) {
      const _registrationGeojson: PointFeature<MyContributionsSingleRegistration>[] =
        [];
      const _donationGeojson: PointFeature<DonationProperties>[] = [];

      setContributionsMap(contributionsResult.myContributionsMap);
      setContributionStats(contributionsResult.stats);
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
            contributionsResult.registrationLocationsMap.get(key);
          if (registrationLocation) {
            const geojson = _generateRegistrationGeojson(
              registrationLocation,
              item
            );
            _registrationGeojson.push(geojson);
          }
        }
      });

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
      isLeaderboardLoaded: !_leaderboard.isLoading && !_leaderboard.isError,
      isProjectsListLoaded: !_projectList.isLoading && !_projectList.isError,
      isContributionsLoaded:
        !_contributions.isLoading && !_contributions.isError,
      contributionsMap,
      registrationGeojson,
      donationGeojson,
      userInfo,
      setUserInfo,
      contributionStats,
    }),
    [
      projectListResult,
      contributionsResult,
      leaderboardResult,
      _leaderboard.isLoading,
      _leaderboard.isError,
      _projectList.isLoading,
      _projectList.isError,
      _contributions.isLoading,
      _contributions.isError,
      contributionsMap,
      registrationGeojson,
      donationGeojson,
      userInfo,
      setUserInfo,
      contributionStats,
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
