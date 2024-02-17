import { useMyForest } from '../../../../../common/Layout/MyForestContext';
import { MyContributionLoader } from '../../../../../common/ContentLoaders/UserProfile/UserProfile';
import PlantedTreesContributions from './PlantedTreesContributions';
import ConservationContributions from './ConservationContributions';
import { User, UserPublicProfile } from '@planet-sdk/common';

interface MyContributionListProps {
  conservationTrpcResponse: any;
  plantedTreesTrpcResponse: any;
  profile: User | UserPublicProfile;
}

const MyContributionList = ({
  conservationTrpcResponse,
  plantedTreesTrpcResponse,
  profile,
}: MyContributionListProps) => {
  const {
    treePlantationContribution,
    conservationContribution,
    isTreePlantedButtonActive,
    isConservedButtonActive,
  } = useMyForest();

  const _checkConditions = () => {
    if (treePlantationContribution) {
      return false;
    } else {
      return true;
    }
  };

  const _checkConditionsForConservation = () => {
    if (conservationContribution) {
      return false;
    } else {
      return true;
    }
  };

  const handleFetchNextPage = (): void => {
    conservationTrpcResponse?.fetchNextPage();
  };
  const handleFetchNextPageforPlantedTrees = (): void => {
    plantedTreesTrpcResponse.fetchNextPage();
  };

  return (
    <>
      {isTreePlantedButtonActive &&
        (_checkConditions() ? (
          <MyContributionLoader />
        ) : (
          <PlantedTreesContributions
            userProfile={profile}
            handleFetchNextPage={handleFetchNextPageforPlantedTrees}
            hasNextPage={plantedTreesTrpcResponse.hasNextPage}
          />
        ))}
      {isConservedButtonActive &&
        (_checkConditionsForConservation() ? (
          <MyContributionLoader />
        ) : (
          <ConservationContributions
            userProfile={profile}
            hasNextPage={conservationTrpcResponse?.hasNextPage}
            handleFetchNextPage={handleFetchNextPage}
          />
        ))}
    </>
  );
};

export default MyContributionList;
