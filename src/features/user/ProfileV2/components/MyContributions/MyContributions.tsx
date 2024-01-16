import { useEffect, useContext, useState, ReactElement } from 'react';
import myForestStyles from '../../../ProfileV2/styles/MyForest.module.scss';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import { trpc } from '../../../../../utils/trpc';
import { Purpose } from '../../../../../utils/constants/myForest';
import { ContributionData } from '../../../../common/types/myForest';
import { StatsResult } from '../../../../common/types/myForest';
import { MyContributionsProps } from '../../../../common/types/map';
import MyContributionCustomButton from '../MicroComponents/CustomButton';
import { SetState } from '../../../../common/types/common';
import { PointFeature } from 'supercluster';
import { TestPointProps } from '../../../../common/types/map';
import { MyForestMapLoader } from '../../../../common/ContentLoaders/UserProfile/UserProfile';
import { useMyForest } from '../../../../common/Layout/MyForestContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import MyContributionList from '../MicroComponents/MyContributionList';

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
  const { setErrors } = useContext(ErrorHandlingContext);
  const { setRefetchData, refetchData } = useUserProps();
  const {
    setTreePlantationContribution,
    treePlantationContribution,
    setConservationContribution,
    conservationContribution,
    setTreePlantationProjectGeoJson,
    setconservationProjectGeoJson,
    additionalInfoRelatedToContributions,
    setAdditionalInfoRelatedToContributions,
    setIsTreePlantedButtonActive,
    setIsConservedButtonActive,
    treePlantationProjectGeoJson,
    setTreePlantGeoJson,
    setRegisteredTreeGeoJson,
    setRestorationGeoJson,
    setIsProcessing,
  } = useMyForest();

  const _detailInfo = trpc.myForest.stats.useQuery(
    {
      profileId: `${profile.id}`,
    },
    {
      enabled: !!profile.id,
      ...queryFetchOptions,
    }
  );
  const _conservedGeoJsonData = trpc.myForest.contributionsGeoJson.useQuery(
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

  const _plantedTreesContribution =
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

  const _conservationContribution =
    trpc.myForest.contributions.useInfiniteQuery(
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
        setIsProcessing(false);
      }
    }
  };
  useEffect(() => {
    _updateStateWithTrpcData<ContributionData | null>(
      _plantedTreesContribution,
      setTreePlantationContribution
    );
  }, [_plantedTreesContribution.data]);

  useEffect(() => {
    _updateStateWithTrpcData<ContributionData | null>(
      _conservationContribution,
      setConservationContribution
    );
  }, [_conservationContribution.data]);

  useEffect(() => {
    _updateStateWithTrpcData<PointFeature<TestPointProps>[]>(
      _treePlantedGeoJsonData,
      setTreePlantationProjectGeoJson
    );
  }, [_treePlantedGeoJsonData.data, refetchData]);

  useEffect(() => {
    _updateStateWithTrpcData<PointFeature<TestPointProps>[]>(
      _conservedGeoJsonData,
      setconservationProjectGeoJson
    );
  }, [_conservedGeoJsonData.data, refetchData]);

  useEffect(() => {
    _updateStateWithTrpcData<StatsResult | undefined>(
      _detailInfo,
      setAdditionalInfoRelatedToContributions
    );
    setRefetchData(false);
  }, [_detailInfo.data, refetchData]);

  useEffect(() => {
    const _checkHigestNumberContribution = () => {
      if (treePlantationContribution && conservationContribution) {
        if (
          treePlantationContribution?.pages[0].data.length >
          conservationContribution?.pages[0].data.length
        ) {
          setIsTreePlantedButtonActive(true);
        } else if (
          conservationContribution?.pages[0].data.length >
          treePlantationContribution?.pages[0].data.length
        ) {
          setIsConservedButtonActive(true);
        } else if (
          treePlantationContribution?.pages[0].data.length ==
          conservationContribution?.pages[0].data.length
        ) {
          setIsTreePlantedButtonActive(true);
        } else {
          setIsConservedButtonActive(false);
          setIsTreePlantedButtonActive(false);
        }
      }
    };
    _checkHigestNumberContribution();
  }, [treePlantationContribution, conservationContribution]);

  useEffect(() => {
    if (_treePlantedGeoJsonData.data) {
      const _onlyRegisteredDonation = _treePlantedGeoJsonData.data.filter(
        (singleContribution) => {
          if (singleContribution?.properties?.contributionType === 'planting')
            return singleContribution;
        }
      );
      const _onlyNormalDonation = _treePlantedGeoJsonData.data.filter(
        (singleContribution) => {
          if (singleContribution?.properties?.contributionType !== 'planting')
            return singleContribution;
        }
      );
      if (_onlyNormalDonation) setTreePlantGeoJson(_onlyNormalDonation);
      if (_onlyRegisteredDonation)
        setRegisteredTreeGeoJson(_onlyRegisteredDonation);
      if (_onlyNormalDonation) {
        const _onlyRestorationGeojson = _onlyNormalDonation.filter(
          (singleGeojson) => {
            return (
              singleGeojson.properties?.purpose === 'trees' &&
              singleGeojson.properties?.plantProject?.unitType === 'm2'
            );
          }
        );
        if (_onlyRestorationGeojson)
          setRestorationGeoJson(_onlyRestorationGeojson);
      }
    }
  }, [treePlantationProjectGeoJson]);
  return ready && additionalInfoRelatedToContributions ? (
    <div className={myForestStyles.mapMainContainer}>
      <MyTreesMap />
      <MyContributionCustomButton
        plantedTrees={additionalInfoRelatedToContributions?.treeCount}
        restoredArea={additionalInfoRelatedToContributions?.squareMeters}
        conservedArea={additionalInfoRelatedToContributions?.conserved}
        projects={additionalInfoRelatedToContributions?.projects}
        countries={additionalInfoRelatedToContributions?.countries}
        donations={additionalInfoRelatedToContributions?.donations}
      />
      <MyContributionList
        conservationTrpcResponse={_conservationContribution}
        plantedTreesTrpcResponse={_plantedTreesContribution}
        profile={profile}
      />
    </div>
  ) : (
    <MyForestMapLoader />
  );
}
