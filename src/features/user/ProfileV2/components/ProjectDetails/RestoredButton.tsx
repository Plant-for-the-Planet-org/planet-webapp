import {
  RestoredSvg,
  DownWardArrowSvg,
  ArrowSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import { ReactElement } from 'react';
import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { useProjectProps } from '../../../../common/Layout/ProjectPropsContext';
import { CircularProgress } from '@mui/material';
import { RestoredButtonProps } from '../../../../common/types/myForest';

const RestoredButton = ({
  restoredArea,
}: RestoredButtonProps): ReactElement => {
  const { t } = useTranslation(['donate']);
  const { isTreePlantedButtonActive } = useProjectProps();

  return (
    <div
      className={
        isTreePlantedButtonActive
          ? myForestStyles.areaRestoredContainerActive
          : myForestStyles.areaRestoredContainer
      }
    >
      {restoredArea === undefined ? (
        <div className={myForestStyles.circularProgressContainer}>
          <CircularProgress color="success" />
        </div>
      ) : (
        <>
          <div className={myForestStyles.areaRestoredLabelContainer}>
            <div>
              <RestoredSvg
                color={isTreePlantedButtonActive ? 'white' : '#219653'}
              />
            </div>
            <div className={myForestStyles.plantedTreesLabel}>
              {t('donate:restored')}
            </div>
          </div>
          <div className={myForestStyles.valueContainer}>
            <div className={myForestStyles.areaRestored}>
              <div>{restoredArea ? restoredArea : 0}</div>
            </div>
            <div className={myForestStyles.restoredUnit}>{'m²'}</div>
            <div className={myForestStyles.svgContainer}>
              {isTreePlantedButtonActive ? (
                <DownWardArrowSvg color={'#FFFFFF'} />
              ) : (
                <ArrowSvg color={'#219653'} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RestoredButton;
