import {
  ConservationTreeSvg,
  DownWardArrowSvg,
  ArrowSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { ConservationButtonProps } from '../../../../common/types/myForest';
import { useProjectProps } from '../../../../common/Layout/ProjectPropsContext';
import { CircularProgress } from '@mui/material';

const ConservationButton = ({
  conservedArea,
}: ConservationButtonProps): ReactElement => {
  const {
    isConservedButtonActive,
    setIsConservedButtonActive,
    setIsTreePlantedButtonActive,
  } = useProjectProps();
  const { t } = useTranslation(['donate']);
  const handleClick = () => {
    if (isConservedButtonActive) {
      setIsConservedButtonActive(false);
    } else {
      if (conservedArea && conservedArea > 0) {
        setIsTreePlantedButtonActive(false);
        setIsConservedButtonActive(true);
      }
    }
  };
  return (
    <div
      className={`${
        isConservedButtonActive
          ? myForestStyles.conservedAreaButtonContainerActive
          : myForestStyles.conservedAreaButtonContainer
      }`}
      onClick={handleClick}
    >
      {conservedArea === undefined ? (
        <div className={myForestStyles.circularProgressContainer}>
          <CircularProgress style={{ color: '#48AADD' }} />
        </div>
      ) : (
        <>
          <div className={myForestStyles.labelContainer}>
            <div className={myForestStyles.conservedSvg}>
              <ConservationTreeSvg
                color={isConservedButtonActive ? 'white' : '#48AADD'}
              />
            </div>
            <div className={myForestStyles.conservedLabel}>
              {t('donate:conservation')}
            </div>
          </div>
          <div className={myForestStyles.conservedAreaValue}>
            <div className={myForestStyles.value}>
              {conservedArea ? conservedArea : 0}
            </div>
            <div className={myForestStyles.unit}>{'m²'}</div>
            <div className={myForestStyles.svgContainer}>
              {isConservedButtonActive ? (
                <DownWardArrowSvg color={'#FFFFFF'} />
              ) : (
                <ArrowSvg color={'#48AADD'} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConservationButton;
