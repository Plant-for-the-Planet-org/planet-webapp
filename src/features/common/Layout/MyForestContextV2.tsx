import {
  FC,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { trpc } from '../../../utils/trpc';
import { SetState } from '../types/common';
import { ErrorHandlingContext } from './ErrorHandlingContext';
import { useUserProps } from './UserPropsContext';
import {
  handleError,
  APIError,
  TreeProjectClassification,
  CountryCode,
  ProjectPurpose,
  UnitTypes,
} from '@planet-sdk/common';
import { Point } from 'geojson';
import {
  ContributionStats,
  MyContributionsMapItem,
  MapLocation,
} from '../types/myForestv2';
import { AnyProps, PointFeature } from 'supercluster';
import { TestPointProps } from '../types/map';

export interface ProjectInfo {
  allowDonations: boolean;
  classification: TreeProjectClassification;
  country: CountryCode;
  geometry: Point;
  guid: string;
  image: string;
  name: string;
  purpose: ProjectPurpose;
  slug: string;
  tpoName: string;
  unitType: UnitTypes;
}
interface RegistrationGeojson {
  geometry: Point | undefined;
  properties: MyContributionsMapItem | undefined;
}

interface Contributions {
  registrationLocationsMap: Map<string, MapLocation>;
  stats: ContributionStats;
  myContributionsMap: Map<string, MyContributionsMapItem | undefined>;
  projectLocationsMap: Map<string, MapLocation>;
}

interface MyForestContextV2Interface {
  projectList: Map<string, ProjectInfo> | undefined;
  setProjectList: SetState<Map<string, ProjectInfo> | undefined>;
  contributions: Contributions | undefined;
  setContributions: SetState<Contributions | undefined>;
  registrationGeojson: PointFeature<TestPointProps>[];
  setRegistrationGeojson: SetState<PointFeature<TestPointProps>[]>;
  donationGeojson: PointFeature<TestPointProps>[];
  setDonationGeojson: SetState<PointFeature<TestPointProps>[]>;
}

const MyForestContextV2 = createContext<MyForestContextV2Interface | null>(
  null
);

export const MyForestProviderV2: FC = ({ children }) => {
  const [projectList, setProjectList] = useState<
    Map<string, ProjectInfo> | undefined
  >(undefined);
  const [contributions, setContributions] = useState<Contributions | undefined>(
    undefined
  );
  const [registrationGeojson, setRegistrationGeojson] = useState<
    PointFeature<AnyProps>[]
  >([]);
  const [donationGeojson, setDonationGeojson] = useState<
    PointFeature<AnyProps>[]
  >([]);
  const { user } = useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);
  const _projectList = trpc.myForestV2.projectList.useQuery();
  const _contributions = trpc.myForestV2.contributions.useQuery({
    profileId: `${user?.id}`,
    slug: `${user?.slug}`,
  });
  const _updateStateWithTrpcData = <T,>(
    trpcProcedure: any,
    stateUpdaterFunction: SetState<T>
  ): void => {
    if (!trpcProcedure.isLoading) {
      if (trpcProcedure.error) {
        setErrors(
          handleError(
            new APIError(
              trpcProcedure.error?.data?.httpStatus as number,
              trpcProcedure.error
            )
          )
        );
      } else {
        stateUpdaterFunction(trpcProcedure?.data);
      }
    }
  };

  useEffect(
    () => _updateStateWithTrpcData(_projectList, setProjectList),
    [_projectList.data]
  );

  useEffect(() => {
    _updateStateWithTrpcData(_contributions, setContributions);
  }, [_contributions.data]);

  //format geojson
  const _donationTreeGeojson = (
    projectList: any,
    contributions: Contributions,
    projectId: string
  ) => {
    return {
      geometry: projectList?.[projectId]?.geometry,
      properties: {
        projectInfo: projectList?.[projectId],
        contributionInfo: contributions?.['myContributionsMap']?.get(projectId),
      },
    };
  };

  const _registeredTreeGeojson = (
    contributions: Contributions,
    key: string
  ) => {
    return {
      geometry: contributions?.['registrationLocationsMap']?.get(key)?.geometry,
      properties: contributions?.['myContributionsMap']?.get(key),
    };
  };

  useEffect(() => {
    if (contributions) {
      const _registrationGeojson: PointFeature<AnyProps>[] = [];
      const _donationGeojson: PointFeature<AnyProps>[] = [];
      //condition to check whether a contribution belongs to donation or register
      contributions.myContributionsMap?.keys().forEach((x: string) => {
        if (x.startsWith('proj_')) {
          const geojson = _donationTreeGeojson(projectList, contributions, x);
          _donationGeojson.push(geojson);
        } else {
          const geojson: RegistrationGeojson = _registeredTreeGeojson(
            contributions,
            x
          );
          _registrationGeojson.push(geojson);
        }
      });
      if (_registrationGeojson.length > 0 && _donationGeojson.length > 0) {
        setRegistrationGeojson(_registrationGeojson);
        setDonationGeojson(_donationGeojson);
      }
    }
  }, [contributions, projectList]);

  const value = useMemo(
    () => ({
      projectList,
      setProjectList,
      contributions,
      setContributions,
      registrationGeojson,
      setRegistrationGeojson,
      donationGeojson,
      setDonationGeojson,
    }),
    [
      projectList,
      setProjectList,
      contributions,
      setContributions,
      registrationGeojson,
      setRegistrationGeojson,
      donationGeojson,
      setDonationGeojson,
    ]
  );

  return (
    <MyForestContextV2.Provider value={value}>
      {children}
    </MyForestContextV2.Provider>
  );
};

export const useMyForestV2 = () => {
  const context = useContext(MyForestContextV2);
  if (!context) {
    throw new Error('MyForestContextV2 must be used within MyForestProvider');
  }
  return context;
};
