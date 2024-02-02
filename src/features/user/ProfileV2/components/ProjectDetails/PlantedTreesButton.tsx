import { PlantedTreesSvg } from '../../../../../../public/assets/images/ProfilePageIcons';
import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { useMyForest } from '../../../../common/Layout/MyForestContext';
import theme from '../../../../../theme/themeProperties';

export interface PlantedTreesButtonProps {
  plantedTrees: number | null;
}

const PlantedTreesButton = ({ plantedTrees }: PlantedTreesButtonProps) => {
  const { light, primaryDarkColorX } = theme;
  const { isTreePlantedButtonActive } = useMyForest();
  const { t } = useTranslation(['donate']);

  return (
    <div
      className={`${
        isTreePlantedButtonActive
          ? myForestStyles.plantedTreesContainerActive
          : myForestStyles.plantedTreesContainer
      }`}
    >
      <div className={myForestStyles.plantedTreesLabelContainer}>
        <div>
          <PlantedTreesSvg
            color={
              isTreePlantedButtonActive
                ? `${light.light}`
                : `${primaryDarkColorX}`
            }
          />
        </div>
        <div className={myForestStyles.plantedTreesLabel}>
          {t('donate:plantedTrees')}
        </div>
      </div>

      <div className={myForestStyles.countTrees}>
        <div>{plantedTrees ? Number(plantedTrees.toFixed(2)) : 0}</div>
      </div>
    </div>
  );
};

export default PlantedTreesButton;
