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
import { SetState } from '../types/common';

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
  treePlanted: number;
  restoredTree: number;
  conservArea: number;
  isTargetModalLoading: boolean;
  setIsTargetModalLoading: SetState<boolean>;
  treeTarget: number;
  setTreeTarget: SetState<number>;
  restoreTarget: number;
  setRestoreTarget: SetState<number>;
  conservTarget: number;
  setConservTarget: SetState<number>;
  treeChecked: boolean;
  setTreeChecked: SetState<boolean>;
  restoreChecked: boolean;
  setRestoreChecked: SetState<boolean>;
  conservChecked: boolean;
  setConservChecked: SetState<boolean>;
}

const MyForestContextV2 = createContext<MyForestContextV2Interface | null>(
  null
);

export const MyForestProviderV2: FC = ({ children }) => {
  const { user } = useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);

  const [projectListResult, setProjectListResult] =
    useState<ProjectListResponse>();
  const [contributionsResult, setContributionsResult] =
    useState<ContributionsResponse>();
  const [registrationGeojson, setRegistrationGeojson] = useState<
    RegistrationGeojson[]
  >([]);
  const [donationGeojson, setDonationGeojson] = useState<DonationGeojson[]>([]);
  const [treePlanted, setTreePlanted] = useState(0);
  const [treeTarget, setTreeTarget] = useState(user?.targets.treesDonated);
  const [treeChecked, setTreeChecked] = useState(false);
  const [restoredTree, setRestoredTree] = useState(0);
  const [restoreTarget, setRestoreTarget] = useState(
    user?.targets.areaRestored
  );
  const [restoreChecked, setRestoreChecked] = useState(false);
  const [conservArea, setConservArea] = useState(0);
  const [conservTarget, setConservTarget] = useState(
    user?.targets.areaConserved
  );
  const [conservChecked, setConservChecked] = useState(false);
  const [isTargetModalLoading, setIsTargetModalLoading] = useState(false);

  const _projectList = trpc.myForestV2.projectList.useQuery();
  const _contributions = trpc.myForestV2.contributions.useQuery({
    profileId: `${user?.id}`,
    slug: `${user?.slug}`,
  });

  const targetStatus = () => {
    if (localStorage.getItem('treeChecked') && treeTarget > 0) {
      //to check if user has treeTarget value but disabled it in the profile
      setTreeChecked(
        localStorage.getItem('treeChecked') === 'false' ? false : true
      );
    } else {
      setTreeChecked(treeTarget > 0);
    }
    if (localStorage.getItem('restoreChecked') && restoreTarget > 0) {
      setRestoreChecked(
        localStorage.getItem('restoreChecked') === 'false' ? false : true
      );
    } else {
      setRestoreChecked(restoreTarget > 0);
    }
    if (localStorage.getItem('conservChecked') && conservTarget > 0) {
      setConservChecked(
        localStorage.getItem('conservChecked') === 'false' ? false : true
      );
    } else {
      setConservChecked(conservTarget > 0);
    }
  };

  useEffect(() => {
    targetStatus();
  }, []);

  const aggregate = () => {
    if (_contributions.data?.stats) {
      const totalTrees =
        _contributions.data?.stats.treesDonated.personal +
        _contributions.data?.stats.treesDonated.received +
        _contributions.data?.stats.treesRegistered;

      const totalRestore =
        _contributions.data?.stats.areaRestoredInM2.personal +
        _contributions.data?.stats.areaRestoredInM2.received;

      const totalConserv =
        _contributions.data?.stats.areaConservedInM2.personal +
        _contributions.data?.stats.areaConservedInM2.received;
      setTreePlanted(totalTrees);
      setRestoredTree(totalRestore);
      setConservArea(totalConserv);
    }
  };

  useEffect(() => {
    aggregate();
  }, [_contributions.data?.stats]);

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
      treePlanted,
      restoredTree,
      conservArea,
      isTargetModalLoading,
      setIsTargetModalLoading,
      treeTarget,
      setTreeTarget,
      restoreTarget,
      setRestoreTarget,
      conservTarget,
      setConservTarget,
      treeChecked,
      setTreeChecked,
      restoreChecked,
      setRestoreChecked,
      conservChecked,
      setConservChecked,
    }),
    [
      projectListResult,
      contributionsResult,
      registrationGeojson,
      donationGeojson,
      treePlanted,
      restoredTree,
      conservArea,
      isTargetModalLoading,
      setIsTargetModalLoading,
      treeTarget,
      setTreeTarget,
      restoreTarget,
      setRestoreTarget,
      conservTarget,
      setConservTarget,
      treeChecked,
      setTreeChecked,
      restoreChecked,
      setRestoreChecked,
      conservChecked,
      setConservChecked,
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
