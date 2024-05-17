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
import { handleError, APIError } from '@planet-sdk/common';
import { RegistrationLocation } from '../types/myForestv2';

interface MyForestContextV2Interface {
  projectList: any;
  setProjectList: any;
  contributions: any;
  setContributions: any;
  normalContributions: any;
  setNormalContributions: any;
  registeredTreesCoordinates: RegistrationLocation[];
  setRegisteredTreesCoordinates: any;
}

const MyForestContextV2 = createContext<MyForestContextV2Interface | null>(
  null
);

export const MyForestProviderV2: FC = ({ children }) => {
  const [projectList, setProjectList] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [normalContributions, setNormalContributions] = useState([]);
  const [registeredTreesCoordinates, setRegisteredTreesCoordinates] = useState<
    RegistrationLocation[]
  >([]);

  const { user } = useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);
  const _projectList = trpc.myForestV2.projectList.useQuery();
  const _contributions = trpc.myForestV2.contributions.useQuery({
    profileId: `prf_d2Huqfo4og2zaxvdMBLwk8Ot`,
    slug: `mohit-bajaj`,
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

  useMemo(
    () => _updateStateWithTrpcData(_projectList, setProjectList),
    [_projectList.data]
  );

  useEffect(() => {
    _updateStateWithTrpcData(_contributions, setContributions);
  }, [_contributions.data]);

  useEffect(() => {
    if (_contributions.data && _projectList.data) {
      const coordinates = _contributions.data.registrationLocationsMap.values();
      setRegisteredTreesCoordinates([...coordinates]);
    }
  }, [_contributions.data]);

  const value = useMemo(
    () => ({
      projectList,
      setProjectList,
      contributions,
      setContributions,
      normalContributions,
      setNormalContributions,
      registeredTreesCoordinates,
      setRegisteredTreesCoordinates,
    }),
    [
      projectList,
      setProjectList,
      contributions,
      setContributions,
      normalContributions,
      setNormalContributions,
      registeredTreesCoordinates,
      setRegisteredTreesCoordinates,
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
