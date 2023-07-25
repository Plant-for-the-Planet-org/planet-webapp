import React, { useContext } from 'react';
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
import { ProjectPropsContext } from '../../../../common/Layout/ProjectPropsContext';
import { Purpose } from '../../../../../utils/constants/myForest';
import { Contributions } from '../../../../common/types/contribution';
import { QueryResult } from '../../../../../server/router/myForest';
import { MyTreesProps } from '../../../../common/types/map';

const MyTreesMap = dynamic(() => import('../MyForestMap'), {
  loading: () => <p>loading</p>,
});

export default function MyTrees({
  profile,
  authenticatedType,
}: MyTreesProps): React.ReactElement | null {
  const { ready } = useTranslation(['country', 'me']);
  const [contribution, setContribution] = React.useState<Contributions[]>([]);
  const [otherDonationInfo, setOthercontributionInfo] = React.useState<
    QueryResult[]
  >([]);
  const [isTreePlantedButtonActive, setIsTreePlantedButtonActive] =
    React.useState<boolean>(false);
  const [isConservedButtonActive, setIsConservedButtonActive] =
    React.useState<boolean>(false);
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const { setConservationProjects, setTreePlantedProjects } =
    useContext(ProjectPropsContext);

  const _detailInfo = trpc.myForest.stats.useQuery({
    profileId: `${profile.id}`,
  });

  const _contributionData = trpc.myForest.contributions.useQuery({
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

  React.useEffect(() => {
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
      } else {
        setContribution(_contributionData.data);
      }
    }
  }, [_contributionData.isLoading]);

  React.useEffect(() => {
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

  React.useEffect(() => {
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

  React.useEffect(() => {
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
        console.log(_detailInfo.data, '==');
        setOthercontributionInfo(_detailInfo.data);
      }
    }
  }, [_detailInfo.isLoading]);

  return ready && otherDonationInfo ? (
    <div
      className={myForestStyles.mapMainContainer}
      style={{
        paddingBottom:
          !isTreePlantedButtonActive || !isConservedButtonActive
            ? '110px'
            : '10px',
      }}
    >
      <MyTreesMap
        isTreePlantedButtonActive={isTreePlantedButtonActive}
        isConservedButtonActive={isConservedButtonActive}
      />
      <div className={myForestStyles.mapButtonMainContainer}>
        <div className={myForestStyles.mapButtonContainer}>
          <PlantedTreesButton
            plantedTrees={otherDonationInfo[0]?.treeCount}
            isTreePlantedButtonActive={isTreePlantedButtonActive}
            setIsConservedButtonActive={setIsConservedButtonActive}
            setIsTreePlantedButtonActive={setIsTreePlantedButtonActive}
          />

          <ConservationButton
            conservedArea={otherDonationInfo[0]?.conserved}
            setIsTreePlantedButtonActive={setIsTreePlantedButtonActive}
            setIsConservedButtonActive={setIsConservedButtonActive}
            isConservedButtonActive={isConservedButtonActive}
          />

          <DonationInfo
            projects={otherDonationInfo[0]?.projects}
            countries={otherDonationInfo[0]?.countries}
            donations={otherDonationInfo[0]?.donations}
          />
        </div>
      </div>

      {isTreePlantedButtonActive && !isConservedButtonActive && (
        <TreeContributedProjectList
          contribution={contribution}
          userprofile={profile}
          authenticatedType={authenticatedType}
        />
      )}

      {isConservedButtonActive && !isTreePlantedButtonActive && (
        <AreaConservedProjectList
          contribution={contribution}
          isConservedButtonActive={isConservedButtonActive}
        />
      )}
    </div>
  ) : null;
}
