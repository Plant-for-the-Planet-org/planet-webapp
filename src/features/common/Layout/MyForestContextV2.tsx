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
import { useUserProps } from './UserPropsContext';

import { Point } from 'geojson';
import {
  ProjectListResponse,
  MyForestProject,
  ContributionsResponse,
  MyContributionsSingleRegistration,
  MyContributionsSingleProject,
  MapLocation,
} from '../types/myForestv2';
import { updateStateWithTrpcData } from '../../../utils/trpcHelpers';

interface RegistrationGeojson {
  geometry: Point;
  properties: MyContributionsSingleRegistration;
}

interface DonationGeojson {
  geometry: Point;
  properties: {
    projectInfo: MyForestProject;
    contributionInfo: MyContributionsSingleProject;
  };
}

interface MyForestContextV2Interface {
  projectListResult: ProjectListResponse | undefined;
  contributionsResult: ContributionsResponse | undefined;
  registrationGeojson: RegistrationGeojson[];
  donationGeojson: DonationGeojson[];
}

const MyForestContextV2 = createContext<MyForestContextV2Interface | null>(
  null
);

export const MyForestProviderV2: FC = ({ children }) => {
  const [projectListResult, setProjectListResult] =
    useState<ProjectListResponse>();
  const [contributionsResult, setContributionsResult] =
    useState<ContributionsResponse>();
  const [registrationGeojson, setRegistrationGeojson] = useState<
    RegistrationGeojson[]
  >([]);
  const [donationGeojson, setDonationGeojson] = useState<DonationGeojson[]>([]);

  const { user } = useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);

  const _projectList = trpc.myForestV2.projectList.useQuery();
  const _contributions = trpc.myForestV2.contributions.useQuery({
    profileId: `${user?.id}`,
    slug: `${user?.slug}`,
  });

  useEffect(() => {
    if (_projectList.data) {
      updateStateWithTrpcData(_projectList, setProjectListResult, setErrors);
    }
  }, [_projectList.data]);

  useEffect(() => {
    if (_contributions.data) {
      updateStateWithTrpcData(
        _contributions,
        setContributionsResult,
        setErrors
      );
    }
  }, [_contributions.data]);

  //format geojson
  const _generateDonationGeojson = (
    project: MyForestProject,
    contributionsForProject: MyContributionsSingleProject
  ) => {
    return {
      geometry: project.geometry,
      properties: {
        projectInfo: project,
        contributionInfo: contributionsForProject,
      },
    };
  };

  const _generateRegistrationGeojson = (
    registrationLocation: MapLocation,
    registration: MyContributionsSingleRegistration
  ) => {
    return {
      geometry: registrationLocation.geometry,
      properties: registration,
    };
  };

  useEffect(() => {
    if (contributionsResult) {
      const _registrationGeojson: RegistrationGeojson[] = [];
      const _donationGeojson: DonationGeojson[] = [];

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
      registrationGeojson,
      donationGeojson,
    }),
    [
      projectListResult,
      contributionsResult,
      registrationGeojson,
      donationGeojson,
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
