import { PlantedTreesSvg } from '../../../../../../public/assets/images/ProfilePageIcons';
import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { useMyForest } from '../../../../common/Layout/MyForestContext';
import theme from '../../../../../theme/themeProperties';
import { getFormattedNumber } from '../../../../../utils/getFormattedNumber';

export interface PlantedTreesButtonProps {
  plantedTrees: number | null;
}

const PlantedTreesButton = ({ plantedTrees }: PlantedTreesButtonProps) => {
  const { light, primaryDarkColorX } = theme;
  const { isTreePlantedButtonActive } = useMyForest();
  const { t, i18n } = useTranslation(['profile']);

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
          {t('profile:myForestMap.treesPlanted')}
        </div>
      </div>

      <div className={myForestStyles.countTrees}>
        <div>{plantedTrees ? getFormattedNumber(i18n.language, plantedTrees) : 0}</div>
      </div>
    </div>
  );
};

export default PlantedTreesButton;
