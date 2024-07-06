import {
  RestoredSvg,
  DownWardArrowSvg,
  ArrowSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import { ReactElement } from 'react';
import myForestStyles from '../../styles/MyForest.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { useMyForest } from '../../../../common/Layout/MyForestContext';
import theme from '../../../../../theme/themeProperties';
import { getFormattedNumber } from '../../../../../utils/getFormattedNumber';

export interface RestoredButtonProps {
  restoredArea: number | null;
  plantedTrees: number | null;
}

const RestoredButton = ({
  restoredArea,
  plantedTrees,
}: RestoredButtonProps): ReactElement => {
  const { primaryDarkColorX, light } = theme;
  const t = useTranslations('Profile');
  const locale = useLocale();
  const { isTreePlantedButtonActive } = useMyForest();

  return (
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
          {t('myForestMap.restored')}
        </div>
      </div>
      <div className={myForestStyles.valueContainer}>
        <div className={myForestStyles.areaRestored}>
          <div>
            {restoredArea ? getFormattedNumber(locale, restoredArea) : 0}
          </div>
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
  );
};

export default RestoredButton;
