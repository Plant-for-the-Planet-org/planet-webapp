import { PlantedTreesSvg } from '../../../../../../public/assets/images/ProfilePageIcons';
import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { CircularProgress } from '@mui/material';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';

export interface PlantedTreesButtonProps {
  plantedTrees: number | null;
}

const PlantedTreesButton = ({ plantedTrees }: PlantedTreesButtonProps) => {
  const { isTreePlantedButtonActive } = useUserProps();
  const { t } = useTranslation(['donate']);

  return (
    <div
      className={`${
        isTreePlantedButtonActive
          ? myForestStyles.plantedTreesContainerActive
          : myForestStyles.plantedTreesContainer
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
