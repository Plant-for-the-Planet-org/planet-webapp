import { useEffect, useContext, useState, ReactElement } from 'react';
import myForestStyles from '../../../ProfileV2/styles/MyForest.module.scss';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import TreeProjectContributions from '../ProjectDetails/TreeProjectContributions';
import { trpc } from '../../../../../utils/trpc';
import ConservProjectContributions from '../ProjectDetails/ConservProjectContributions';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { Purpose } from '../../../../../utils/constants/myForest';
import { ContributionData } from '../../../../common/types/myForest';
import { StatsResult } from '../../../../common/types/myForest';
import { MyContributionsProps } from '../../../../common/types/map';
import MyContributionCustomButton from '../MicroComponents/CustomButton';
import { SetState } from '../../../../common/types/common';
import { PointFeature } from 'supercluster';
import { TestPointProps } from '../../../../common/types/map';
import {
  MyContributionLoader,
  MyForestMapLoader,
} from '../../../../common/ContentLoaders/UserProfile/UserProfile';

const A_DAY_IN_MS = 1000 * 60 * 60 * 24;

const queryFetchOptions = {
  refetchOnWindowFocus: false,
  staleTime: A_DAY_IN_MS,
  retry: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
};

const MyTreesMap = dynamic(() => import('../MyForestMap'), {
  loading: () => <p>loading</p>,
});

export default function MyContributions({
  profile,
}: MyContributionsProps): ReactElement | null {
  const { ready } = useTranslation(['country', 'me']);

  const [projectsForTreePlantation, setProjectsForTreePlantation] =
    useState<ContributionData | null>(null);
  const [projectsForAreaConservation, setProjectsForAreaConservation] =
    useState<ContributionData | null>(null);
  const [otherDonationInfo, setOthercontributionInfo] = useState<
    StatsResult | undefined
  >(undefined);

  const [page, setPage] = useState(0);
  const { setErrors } = useContext(ErrorHandlingContext);

  const {
    setConservationProjects,
    setTreePlantedProjects,
    isConservedButtonActive,
    isTreePlantedButtonActive,
    refetchData,
    setRefetchData,
  } = useUserProps();

  const _checkConditions = () => {
    if (projectsForTreePlantation) {
      return false;
    } else {
      return true;
    }
  };

  const _checkConditionsForConservation = () => {
    if (projectsForAreaConservation) {
      return false;
    } else {
      return true;
    }
  };

  const _detailInfo = trpc.myForest.stats.useQuery(
    {
      profileId: `${profile.id}`,
    },
    {
      enabled: !!profile.id,
      ...queryFetchOptions,
    }
  );
  const _conservationGeoJsonData = trpc.myForest.contributionsGeoJson.useQuery(
    {
      profileId: `${profile.id}`,
      purpose: Purpose.CONSERVATION,
    },
    {
      enabled: !!profile.id,
      ...queryFetchOptions,
    }
  );

  const _treePlantedGeoJsonData = trpc.myForest.contributionsGeoJson.useQuery(
    {
      profileId: `${profile.id}`,
      purpose: Purpose.TREES,
    },
    {
      enabled: !!profile.id,
      ...queryFetchOptions,
    }
  );

  const _contributionDataForPlantedtrees =
    trpc.myForest.contributions.useInfiniteQuery(
      {
        profileId: `${profile.id}`,
        limit: 15,
        purpose: Purpose.TREES,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!profile.id,
        ...queryFetchOptions,
      }
    );

  const _contributionData = trpc.myForest.contributions.useInfiniteQuery(
    {
      profileId: `${profile.id}`,
      limit: 15,
      purpose: Purpose.CONSERVATION,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!profile.id,
      ...queryFetchOptions,
    }
  );

  const handleFetchNextPage = (): void => {
    _contributionData.fetchNextPage();
    setPage((prev) => prev + 1);
  };
  const handleFetchNextPageforPlantedTrees = (): void => {
    _contributionDataForPlantedtrees.fetchNextPage();
    setPage((prev) => prev + 1);
  };

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
      }
      if (trpcProcedure?.data && refetchData) {
        trpcProcedure?.refetch();
        stateUpdaterFunction(trpcProcedure?.data);
      } else {
        stateUpdaterFunction(trpcProcedure?.data);
      }
    }
  };
  useEffect(() => {
    _updateStateWithTrpcData<ContributionData | null>(
      _contributionData,
      setProjectsForAreaConservation
    );
  }, [_contributionData.data]);

  useEffect(() => {
    _updateStateWithTrpcData<ContributionData | null>(
      _contributionDataForPlantedtrees,
      setProjectsForTreePlantation
    );
  }, [_contributionDataForPlantedtrees.data]);

  useEffect(() => {
    _updateStateWithTrpcData<PointFeature<TestPointProps>[]>(
      _conservationGeoJsonData,
      setConservationProjects
    );
  }, [_conservationGeoJsonData.data]);

  useEffect(() => {
    _updateStateWithTrpcData<PointFeature<TestPointProps>[]>(
      _treePlantedGeoJsonData,
      setTreePlantedProjects
    );
  }, [_treePlantedGeoJsonData.data]);

  useEffect(() => {
    _updateStateWithTrpcData<StatsResult | undefined>(
      _detailInfo,
      setOthercontributionInfo
    );
    setRefetchData(false);
  }, [_detailInfo.data, refetchData]);

  return ready && otherDonationInfo ? (
    <div className={myForestStyles.mapMainContainer}>
      <MyTreesMap />
      <MyContributionCustomButton
        plantedTrees={otherDonationInfo?.treeCount}
        restoredArea={otherDonationInfo?.squareMeters}
        conservedArea={otherDonationInfo?.conserved}
        projects={otherDonationInfo?.projects}
        countries={otherDonationInfo?.countries}
        donations={otherDonationInfo?.donations}
      />

      {isTreePlantedButtonActive ? (
        _checkConditions() ? (
          <MyContributionLoader />
        ) : (
          <TreeProjectContributions
            restoredAreaUnit={_detailInfo.data?.squareMeters}
            contribution={projectsForTreePlantation}
            userProfile={profile}
            handleFetchNextPage={handleFetchNextPageforPlantedTrees}
          />
        )
      ) : (
        <></>
      )}

      {isConservedButtonActive ? (
        _checkConditionsForConservation() ? (
          <MyContributionLoader />
        ) : (
          <ConservProjectContributions
            contribution={projectsForAreaConservation}
            handleFetchNextPage={handleFetchNextPage}
          />
        )
      ) : (
        <></>
      )}
    </div>
  ) : (
    <MyForestMapLoader />
  );
}
