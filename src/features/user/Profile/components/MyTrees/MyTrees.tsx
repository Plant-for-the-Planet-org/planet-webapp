import React from 'react';
import myForestStyles from '../../../ProfileV2/styles/MyForest.module.scss';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import PlantedTreesButton from '../../../ProfileV2/components/PlantedTreesButton';
import ConservationButton from '../../../ProfileV2/components/ConservationButton';
import DonationInfo from '../../../ProfileV2/components/DonationInfo';
import TreeContributedProjectList from '../../../ProfileV2/components/TreeContributedProjectList';
import { trpc } from '../../../../../utils/trpc';
import AreaConservedProjectList from '../../../ProfileV2/components/AreaConservedProjectList';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import {
  getAuthenticatedRequest,
  getRequest,
} from '../../../../../utils/apiRequests/api';
const MyTreesMap = dynamic(() => import('./MyTreesMap'), {
  loading: () => <p>loading</p>,
});

interface Props {
  profile: any;
  authenticatedType: any;
  token: any;
}

export default function MyTrees({ profile, authenticatedType, token }: Props) {
  const { ready } = useTranslation(['country', 'me']);
  const [contributions, setContributions] = React.useState();
  const [contributionsNew, setContributionsNew] = React.useState();
  const { logoutUser } = useUserProps();
  const [donationOtherInfo, setDonationOtherInfo] = React.useState(undefined);
  const [isTreePlantedButtonActive, setIsTreePlantedButtonActive] =
    React.useState(false);
  const [isConservedButtonActive, setIsConservedButtonActive] =
    React.useState(false);
  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    async function loadFunction() {
      if (authenticatedType === 'private' && token) {
        try {
          const result = await getAuthenticatedRequest(
            `/app/profile/contributions`,
            token,
            logoutUser
          );
          setContributions(result);
        } catch (err) {
          setErrors(handleError(err as APIError));
          redirect('/profile');
        }
      } else {
        try {
          const result = await getRequest(
            `/app/profiles/${profile.id}/contributions`
          );
          setContributions(result);
        } catch (err) {
          setErrors(handleError(err as APIError));
        }
      }
    }
    loadFunction();
  }, [profile]);

  const MapProps = {
    contributions,
    authenticatedType,
  };

  const detailInfo = trpc.myForest.stats.useQuery({
    profileId: `${profile.id}`,
  });

  const contributionData = trpc.myForest.contribution.useQuery({
    profileId: `${profile.id}`,
  });

  React.useEffect(() => {
    if (!contributionData.isLoading) {
      if (contributionData.error) {
        setErrors(
          handleError(
            new APIError(
              contributionData.error?.data?.httpStatus as number,
              contributionData.error
            )
          )
        );
      } else {
        setContributionsNew(contributionData.data);
      }
      console.log('==>', contributionData.data);
    }
  }, [contributionData.isLoading]);

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
        console.log('===>', detailInfo.data);
        setDonationOtherInfo(detailInfo.data);
      }
    }
  }, [detailInfo.isLoading]);

  return donationOtherInfo && contributions && ready ? (
    <div
      className={myForestStyles.mapMainContainer}
      style={{
        paddingBottom:
          !isTreePlantedButtonActive || !isConservedButtonActive
            ? '110px'
            : '10px',
      }}
    >
      <MyTreesMap {...MapProps} />
      <div className={myForestStyles.mapButtonContainer}>
        <PlantedTreesButton
          plantedTrees={donationOtherInfo[0].treeCount}
          isTreePlantedButtonActive={isTreePlantedButtonActive}
          setIsConservedButtonActive={setIsConservedButtonActive}
          setIsTreePlantedButtonActive={setIsTreePlantedButtonActive}
        />
        <div>
          <ConservationButton
            conservedArea={donationOtherInfo[0].conserved}
            setIsTreePlantedButtonActive={setIsTreePlantedButtonActive}
            setIsConservedButtonActive={setIsConservedButtonActive}
            isConservedButtonActive={isConservedButtonActive}
          />
        </div>
        <DonationInfo
          projects={donationOtherInfo[0]?.projects}
          countries={donationOtherInfo[0]?.countries}
          donations={donationOtherInfo[0]?.donations}
        />
      </div>
      {isTreePlantedButtonActive &&
        !isConservedButtonActive &&
        donationOtherInfo[0].treeCount > 0 && (
          <TreeContributedProjectList
            contribution={contributionsNew}
            userprofile={profile}
            authenticatedType={authenticatedType}
          />
        )}

      {isConservedButtonActive &&
        !isTreePlantedButtonActive &&
        donationOtherInfo[0].conserved > 0 && (
          <AreaConservedProjectList
            isConservedButtonActive={isConservedButtonActive}
          />
        )}
    </div>
  ) : null;
}
