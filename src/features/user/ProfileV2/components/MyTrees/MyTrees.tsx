import { useEffect, useContext, useState, ReactElement } from 'react';
import myForestStyles from '../../../ProfileV2/styles/MyForest.module.scss';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import PlantedTreesButton from '../ProjectDetails/PlantedTreesButton';
import ConservationButton from '../ProjectDetails/ConservationButton';
import DonationInfo from '../ProjectDetails/DonationInfo';
import TreeContributedProjectList from '../ProjectDetails/TreeContributedProjectList';
import { trpc } from '../../../../../utils/trpc';
import AreaConservedProjectList from '../ProjectDetails/AreaConservedProjectList';
import { useProjectProps } from '../../../../common/Layout/ProjectPropsContext';
import { Purpose } from '../../../../../utils/constants/myForest';
import { Contributions } from '../../../../common/types/myForest';
import { QueryResult } from '../../../../../server/router/myForest';
import { MyTreesProps } from '../../../../common/types/map';

const MyTreesMap = dynamic(() => import('../MyForestMap'), {
  loading: () => <p>loading</p>,
});

export default function MyTrees({
  profile,
  authenticatedType,
}: MyTreesProps): ReactElement | null {
  const { ready } = useTranslation(['country', 'me']);
  const [projectsForTreePlantaion, setProjectsForTreePlantaion] = useState<
    Contributions[]
  >([]);
  const [projectsForAreaConservation, setProjectsForAreaConservation] =
    useState<Contributions[]>([]);
  const [otherDonationInfo, setOthercontributionInfo] = useState<QueryResult[]>(
    []
  );
  const [page, setPage] = useState(0);
  const { setErrors } = useContext(ErrorHandlingContext);
  const {
    setConservationProjects,
    setTreePlantedProjects,
    isConservedButtonActive,
    isTreePlantedButtonActive,
  } = useProjectProps();

  const _detailInfo = trpc.myForest.stats.useQuery({
    profileId: `${profile.id}`,
  });

  const _conservationGeoJsonData = trpc.myForest.contributionsGeoJson.useQuery({
    profileId: `${profile.id}`,
    purpose: Purpose.CONSERVATION,
  });

  const _treePlantedData = trpc.myForest.contributionsGeoJson.useQuery({
    profileId: `${profile.id}`,
    purpose: Purpose.TREES,
  });

  const _contributionDataForPlantedtrees =
    trpc.myForest.contributions.useInfiniteQuery(
      {
        profileId: `${profile.id}`,
        limit: 15,
        purpose: Purpose.TREES,
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const _contributionData = trpc.myForest.contributions.useInfiniteQuery(
    {
      profileId: `${profile.id}`,
      limit: 15,
      purpose: Purpose.CONSERVATION,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const handleFetchNextPage = (): void => {
    _contributionData.fetchNextPage();
    setPage((prev) => prev + 1);
  };
  const handleFetchNextPageforPlantedTrees = (): void => {
    _contributionDataForPlantedtrees.fetchNextPage();
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (!_contributionData.isLoading) {
      if (_contributionData.error) {
        setErrors(
          handleError(
            new APIError(
              _contributionData.error?.data?.httpStatus as number,
              _contributionData.error
            )
          )
        );
      }

      setProjectsForAreaConservation(_contributionData.data?.pages);
    }
  }, [_contributionData.isLoading, _contributionData.data]);

  useEffect(() => {
    if (!_contributionDataForPlantedtrees.isLoading) {
      if (_contributionDataForPlantedtrees.error) {
        setErrors(
          handleError(
            new APIError(
              _contributionDataForPlantedtrees.error?.data
                ?.httpStatus as number,
              _contributionDataForPlantedtrees.error
            )
          )
        );
      }

      setProjectsForTreePlantaion(_contributionDataForPlantedtrees.data?.pages);
    }
  }, [
    _contributionDataForPlantedtrees.isLoading,
    _contributionDataForPlantedtrees.data,
  ]);

  useEffect(() => {
    if (!_conservationGeoJsonData.isLoading) {
      if (_conservationGeoJsonData.error) {
        setErrors(
          handleError(
            new APIError(
              _conservationGeoJsonData.error?.data?.httpStatus as number,
              _conservationGeoJsonData.error
            )
          )
        );
      } else {
        setConservationProjects(_conservationGeoJsonData.data);
      }
    }
  }, [_conservationGeoJsonData.isLoading]);

  useEffect(() => {
    if (!_treePlantedData.isLoading) {
      if (_treePlantedData.error) {
        setErrors(
          handleError(
            new APIError(
              _treePlantedData.error?.data?.httpStatus as number,
              _treePlantedData.error
            )
          )
        );
      } else {
        setTreePlantedProjects(_treePlantedData.data);
      }
    }
  }, [_treePlantedData.isLoading]);

  useEffect(() => {
    if (!_detailInfo.isLoading) {
      if (_detailInfo.error) {
        setErrors(
          handleError(
            new APIError(
              _detailInfo.error?.data?.httpStatus as number,
              _detailInfo.error
            )
          )
        );
      } else {
        setOthercontributionInfo(_detailInfo.data);
      }
    }
  }, [_detailInfo.isLoading]);

  return ready && otherDonationInfo ? (
    <div className={myForestStyles.mapMainContainer}>
      <MyTreesMap />
      <div className={myForestStyles.mapButtonMainContainer}>
        <div className={myForestStyles.mapButtonContainer}>
          <PlantedTreesButton plantedTrees={otherDonationInfo?.treeCount} />
          <ConservationButton conservedArea={otherDonationInfo?.conserved} />
          <DonationInfo
            projects={otherDonationInfo?.projects}
            countries={otherDonationInfo?.countries}
            donations={otherDonationInfo?.donations}
          />
        </div>
      </div>

      {isTreePlantedButtonActive && !isConservedButtonActive && (
        <TreeContributedProjectList
          contribution={projectsForTreePlantaion}
          userprofile={profile}
          authenticatedType={authenticatedType}
          handleFetchNextPage={handleFetchNextPageforPlantedTrees}
        />
      )}

      {isConservedButtonActive && !isTreePlantedButtonActive && (
        <AreaConservedProjectList
          contribution={projectsForAreaConservation}
          handleFetchNextPage={handleFetchNextPage}
        />
      )}
    </div>
  ) : null;
}
