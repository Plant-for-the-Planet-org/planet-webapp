import PlantedTreesButton from '../ProjectDetails/PlantedTreesButton';
import RestoredButton from '../ProjectDetails/RestoredButton';
import ConservationButton from '../ProjectDetails/ConservationButton';
import DonationInfo from '../ProjectDetails/DonationInfo';
import myForestStyles from '../../styles/MyForest.module.scss';
import SwipeLeftIcon from '@mui/icons-material/SwipeLeft';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { ReactElement } from 'react';

interface CustomButtonProps {
  plantedTrees: number | null;
  restoredArea: number | null;
  conservedArea: number | null;
  projects: number | null;
  countries: number | null;
  donations: number | null;
}

const MyContributionCustomButton = ({
  plantedTrees,
  restoredArea,
  conservedArea,
  projects,
  countries,
  donations,
}: CustomButtonProps): ReactElement => {
  const {
    setIsTreePlantedButtonActive,
    setIsConservedButtonActive,
    isTreePlantedButtonActive,
  } = useUserProps();

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
      <div className={myForestStyles.swipeConatiner}>
        <SwipeLeftIcon />
      </div>
    </>
  );
};

export default MyContributionCustomButton;
