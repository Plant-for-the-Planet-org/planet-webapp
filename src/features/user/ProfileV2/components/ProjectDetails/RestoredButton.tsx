import {
  RestoredSvg,
  DownWardArrowSvg,
  ArrowSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import { ReactElement } from 'react';
import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { useMyForest } from '../../../../common/Layout/MyForestContext';
import theme from '../../../../../theme/themeProperties';

export interface RestoredButtonProps {
  restoredArea: number | null;
  plantedTrees: number | null;
}

const RestoredButton = ({
  restoredArea,
  plantedTrees,
}: RestoredButtonProps): ReactElement => {
  const { primaryDarkColorX, light } = theme;
  const { t, ready } = useTranslation(['profile']);
  const { isTreePlantedButtonActive } = useMyForest();

  return ready ? (
    <div
      className={
        isTreePlantedButtonActive
          ? myForestStyles.areaRestoredContainerActive
          : myForestStyles.areaRestoredContainer
      }
    >
      <div className={myForestStyles.areaRestoredLabelContainer}>
        <div>
          <RestoredSvg
            color={
              isTreePlantedButtonActive
                ? `${light.light}`
                : `${primaryDarkColorX}`
            }
          />
        </div>
        <div className={myForestStyles.plantedTreesLabel}>
          {t('profile:myForestMap.restored')}
        </div>
      </div>
      <div className={myForestStyles.valueContainer}>
        <div className={myForestStyles.areaRestored}>
          <div>{restoredArea ? restoredArea : 0}</div>
        </div>
        <div className={myForestStyles.restoredUnit}>{'m²'}</div>
        {restoredArea !== null &&
          plantedTrees !== null &&
          restoredArea > 0 &&
          plantedTrees > 0 && (
            <div className={myForestStyles.svgContainer}>
              {isTreePlantedButtonActive ? (
                <DownWardArrowSvg color={`${light.light}`} />
              ) : (
                <ArrowSvg color={`${primaryDarkColorX}`} />
              )}
            </div>
          )}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default RestoredButton;
