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
import { Contributions } from '../../../../common/types/myForest';
import { StatsQueryResult } from '../../../../common/types/myForest';
import { MyContributionsProps } from '../../../../common/types/map';
import MyContributionCustomButton from '../MicroComponents/CustomButton';

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

  const [projectsForTreePlantaion, setProjectsForTreePlantation] = useState<
    Contributions[]
  >([]);
  const [projectsForAreaConservation, setProjectsForAreaConservation] =
    useState<Contributions[]>([]);
  const [otherDonationInfo, setOthercontributionInfo] = useState<
    StatsQueryResult | undefined
  >(undefined);
  const [page, setPage] = useState(0);
  const { setErrors } = useContext(ErrorHandlingContext);

  const {
    setConservationProjects,
    setTreePlantedProjects,
    isConservedButtonActive,
    isTreePlantedButtonActive,
  } = useUserProps();

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

  const _updateStateWithTrpcData = (
    trpcProcedure: any,
    stateUpdaterFunction: any
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
      stateUpdaterFunction(trpcProcedure?.data);
    }
  };

  useEffect(() => {
    _updateStateWithTrpcData(_contributionData, setProjectsForAreaConservation);
  }, [_contributionData.isLoading, _contributionData.data]);

  useEffect(() => {
    _updateStateWithTrpcData(
      _contributionDataForPlantedtrees,
      setProjectsForTreePlantation
    );
  }, [
    _contributionDataForPlantedtrees.isLoading,
    _contributionDataForPlantedtrees.data,
  ]);

  useEffect(() => {
    _updateStateWithTrpcData(_conservationGeoJsonData, setConservationProjects);
  }, [_conservationGeoJsonData.isLoading]);

  useEffect(() => {
    _updateStateWithTrpcData(_treePlantedGeoJsonData, setTreePlantedProjects);
  }, [_treePlantedGeoJsonData.isLoading]);

  useEffect(() => {
    _updateStateWithTrpcData(_detailInfo, setOthercontributionInfo);
  }, [_detailInfo.isLoading]);

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
      {isTreePlantedButtonActive && !isConservedButtonActive && (
        <TreeProjectContributions
          contribution={projectsForTreePlantaion}
          userprofile={profile}
          handleFetchNextPage={handleFetchNextPageforPlantedTrees}
        />
      )}
      {isConservedButtonActive && !isTreePlantedButtonActive && (
        <ConservProjectContributions
          contribution={projectsForAreaConservation}
          handleFetchNextPage={handleFetchNextPage}
        />
      )}
    </div>
  ) : null;
}
