import {
  PlantedTreesSvg,
  PlantedTreesGreenSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { PlantedTreesButtonProps } from '../../../../common/types/myForest';
import { CircularProgress } from '@mui/material';
import { useProjectProps } from '../../../../common/Layout/ProjectPropsContext';

const PlantedTreesButton = ({ plantedTrees }: PlantedTreesButtonProps) => {
  const { isTreePlantedButtonActive } = useProjectProps();
  const { t } = useTranslation(['donate']);

  return (
    <div
      className={`${
        isTreePlantedButtonActive
          ? myForestStyles.plantedTreesContainer
          : myForestStyles.plantedTreesContainerX
      }`}
    >
      {plantedTrees === undefined ? (
        <div className={myForestStyles.circularProgressContainer}>
          <CircularProgress color="success" />
        </div>
      ) : (
        <>
          <div className={myForestStyles.plantedTreesLabelContainer}>
            <div>
              <PlantedTreesSvg
                color={isTreePlantedButtonActive ? 'white' : '#219653'}
              />
            </div>
            <div className={myForestStyles.plantedTreesLabel}>
              {t('donate:plantedTrees')}
            </div>
          </div>

          <div className={myForestStyles.countTrees}>
            <div>{plantedTrees ? plantedTrees : 0}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlantedTreesButton;
