import {
  PlantedTreesSvg,
  PlantedTreesGreenSvg,
} from '../../../../../public/assets/images/ProfilePageIcons';
import myForestStyles from '../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';

const PlantedTreesButton = ({
  plantedTrees,
  isTreePlantedButtonActive,
  setIsConservedButtonActive,
  setIsTreePlantedButtonActive,
}) => {
  const { t } = useTranslation(['donate']);
  const handleClick = () => {
    if (isTreePlantedButtonActive) {
      setIsTreePlantedButtonActive(false);
    } else {
      setIsTreePlantedButtonActive(true);
      setIsConservedButtonActive(false);
    }
  };
  return (
    <div
      className={`${
        isTreePlantedButtonActive
          ? myForestStyles.plantedTreesContainer
          : myForestStyles.plantedTreesContainerX
      }`}
      onClick={handleClick}
    >
      <div className={myForestStyles.plantedTreesLabelContainer}>
        <div>
          {isTreePlantedButtonActive ? (
            <PlantedTreesSvg />
          ) : (
            <PlantedTreesGreenSvg />
          )}
        </div>
        <div className={myForestStyles.plantedTreesLabel}>
          {t('donate:plantedTrees')}
        </div>
      </div>

      <div className={myForestStyles.countTrees}>
        <div>{plantedTrees}</div>
      </div>
    </div>
  );
};

export default PlantedTreesButton;
