import {
  PlantedTreesSvg,
  PlantedTreesGreenSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { PlantedTreesButtonProps } from '../../../../common/types/myForest';
import { useContext } from 'react';
import { useProjectProps } from '../../../../common/Layout/ProjectPropsContext';

const PlantedTreesButton = ({ plantedTrees }: PlantedTreesButtonProps) => {
  const {
    isTreePlantedButtonActive,
    setIsTreePlantedButtonActive,
    setIsConservedButtonActive,
  } = useProjectProps();
  const { t } = useTranslation(['donate']);
  const handleClick = () => {
    if (isTreePlantedButtonActive) {
      setIsTreePlantedButtonActive(false);
    } else {
      if (plantedTrees && plantedTrees > 0) {
        setIsTreePlantedButtonActive(true);
        setIsConservedButtonActive(false);
      }
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
        <div>{plantedTrees ? plantedTrees : 0}</div>
      </div>
    </div>
  );
};

export default PlantedTreesButton;
