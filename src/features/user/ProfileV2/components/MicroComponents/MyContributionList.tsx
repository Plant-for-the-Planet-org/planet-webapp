import { useMyForest } from '../../../../common/Layout/MyForestContext';
import { MyContributionLoader } from '../../../../common/ContentLoaders/UserProfile/UserProfile';
import PlantedTreesContributions from '../ProjectDetails/PlantedTreesContributions';
import ConservationContributions from '../ProjectDetails/ConservationContributions';
import { User } from '@planet-sdk/common';

interface MyContributionListProps {
  conservationTrpcResponse: any;
  plantedTreesTrpcResponse: any;
  profile: User | null;
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
    setIsProcessing,
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
    if (plantedTreesTrpcResponse.status === 'success') {
      setIsProcessing(false);
    }
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
            hasNextPage={conservationTrpcResponse?.hasNextPage}
            handleFetchNextPage={handleFetchNextPage}
          />
        ))}
    </>
  );
};

export default MyContributionList;
