import {
  ConservationBlueTreeSvg,
  ConservationWhiteTreeSvg,
  DownWardArrowSvg,
  ArrowSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { ConservationButtonProps } from '../../../../common/types/contribution';
import { useContext } from 'react';
import { ProjectPropsContext } from '../../../../common/Layout/ProjectPropsContext';

const ConservationButton = ({
  conservedArea,
}: ConservationButtonProps): ReactElement => {
  const {
    isConservedButtonActive,
    setIsConservedButtonActive,
    setIsTreePlantedButtonActive,
  } = useContext(ProjectPropsContext);
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
          ? myForestStyles.conservedAreaContainerX
          : myForestStyles.conservedAreaContainer
      }`}
      onClick={handleClick}
    >
      <div className={myForestStyles.labelContainer}>
        <div className={myForestStyles.conservedSvg}>
          {isConservedButtonActive ? (
            <ConservationWhiteTreeSvg />
          ) : (
            <ConservationBlueTreeSvg />
          )}
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
          {isConservedButtonActive ? <DownWardArrowSvg /> : <ArrowSvg />}
        </div>
      </div>
    </div>
  );
};

export default ConservationButton;
