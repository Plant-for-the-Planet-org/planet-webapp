import PlantedTreesButton from './PlantedTreesButton';
import RestoredButton from './RestoredButton';
import ConservationButton from './ConservationButton';
import DonationInfo from './DonationInfo';
import myForestStyles from '../../styles/MyForest.module.scss';
import { useMyForest } from '../../../../common/Layout/MyForestContext';
import { ReactElement } from 'react';

interface ContributionStatsProps {
  plantedTrees: number | null;
  restoredArea: number | null;
  conservedArea: number | null;
  projects: number | null;
  countries: number | null;
  donations: number | null;
}

const ContributionStats = ({
  plantedTrees,
  restoredArea,
  conservedArea,
  projects,
  countries,
  donations,
}: ContributionStatsProps): ReactElement => {
  const {
    setIsTreePlantedButtonActive,
    setIsConservedButtonActive,
    isTreePlantedButtonActive,
  } = useMyForest();

  const handleClick = () => {
    if (isTreePlantedButtonActive) {
      setIsTreePlantedButtonActive(false);
    } else {
      if (plantedTrees || restoredArea) {
        if (
          (plantedTrees !== null && plantedTrees > 0) ||
          (restoredArea !== null && restoredArea > 0)
        ) {
          setIsTreePlantedButtonActive(true);
          setIsConservedButtonActive(false);
        }
      }
    }
  };
  return (
    <>
      <div className={myForestStyles.mapButtonMainContainer}>
        <div className={myForestStyles.mapButtonContainer}>
          <div
            className={myForestStyles.treePlantationButtonConatiner}
            onClick={handleClick}
          >
            <PlantedTreesButton plantedTrees={plantedTrees} />
            <RestoredButton
              restoredArea={restoredArea}
              plantedTrees={plantedTrees}
            />
          </div>
          <ConservationButton conservedArea={conservedArea} />
          <DonationInfo
            projects={projects}
            countries={countries}
            donations={donations}
          />
        </div>
      </div>
    </>
  );
};

export default ContributionStats;
