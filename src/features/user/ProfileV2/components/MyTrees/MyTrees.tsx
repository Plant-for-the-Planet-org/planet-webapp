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

const MyTreesMap = dynamic(() => import('../MyForestMap'), {
  loading: () => <p>loading</p>,
});

interface Props {
  profile: any;
  authenticatedType: any;
  token: any;
}

export default function MyTrees({ profile, authenticatedType }: Props) {
  const { ready } = useTranslation(['country', 'me']);
  const [contribution, setContribution] = React.useState([]);
  const [otherDonationInfo, setOthercontributionInfo] =
    React.useState(undefined);
  const [isTreePlantedButtonActive, setIsTreePlantedButtonActive] =
    React.useState(false);
  const [isConservedButtonActive, setIsConservedButtonActive] =
    React.useState(false);
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const { setConservationProjects, setTreePlantedProjects } =
    useContext(ProjectPropsContext);

  const detailInfo = trpc.myForest.stats.useQuery({
    profileId: `prf_oYOzG6LrTeFkhtEomszwODcP`,
  });

  const _contributionData = trpc.myForest.contributions.useQuery({
    profileId: `prf_oYOzG6LrTeFkhtEomszwODcP`,
  });
  const _conservationGeoJsonData = trpc.myForest.contributionsGeoJson.useQuery({
    profileId: `prf_oYOzG6LrTeFkhtEomszwODcP`,
    purpose: Purpose.CONSERVATION,
  });

  const _treePlantedData = trpc.myForest.contributionsGeoJson.useQuery({
    profileId: `prf_oYOzG6LrTeFkhtEomszwODcP`,
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
    if (!detailInfo.isLoading) {
      if (detailInfo.error) {
        setErrors(
          handleError(
            new APIError(
              detailInfo.error?.data?.httpStatus as number,
              detailInfo.error
            )
          )
        );
      } else {
        setOthercontributionInfo(detailInfo.data);
      }
    }
  }, [detailInfo.isLoading]);

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
      <div className={myForestStyles.mapButtonContainer}>
        <PlantedTreesButton
          plantedTrees={otherDonationInfo[0]?.treeCount}
          isTreePlantedButtonActive={isTreePlantedButtonActive}
          setIsConservedButtonActive={setIsConservedButtonActive}
          setIsTreePlantedButtonActive={setIsTreePlantedButtonActive}
        />
        <div>
          <ConservationButton
            conservedArea={otherDonationInfo[0]?.conserved}
            setIsTreePlantedButtonActive={setIsTreePlantedButtonActive}
            setIsConservedButtonActive={setIsConservedButtonActive}
            isConservedButtonActive={isConservedButtonActive}
          />
        </div>
        <DonationInfo
          projects={otherDonationInfo[0]?.projects}
          countries={otherDonationInfo[0]?.countries}
          donations={otherDonationInfo[0]?.donations}
        />
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
