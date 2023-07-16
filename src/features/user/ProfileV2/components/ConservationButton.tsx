import {
  ConservationBlueTreeSvg,
  ConservationWhiteTreeSvg,
  DownWardArrowSvg,
  ArrowSvg,
} from '../../../../../public/assets/images/ProfilePageIcons';
import myForestStyles from '../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';

const ConservationButton = ({
  conservedArea,
  setIsTreePlantedButtonActive,
  setIsConservedButtonActive,
  isConservedButtonActive,
}) => {
  const { t } = useTranslation(['donate']);
  const handleClick = () => {
    if (isConservedButtonActive) {
      setIsConservedButtonActive(false);
    } else {
      setIsTreePlantedButtonActive(false);
      setIsConservedButtonActive(true);
      // if (conservedArea > 0) {
      // }
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
        <div className={myForestStyles.value}>{conservedArea}</div>
        <div className={myForestStyles.unit}>{'m²'}</div>
        <div className={myForestStyles.svgContainer}>
          {isConservedButtonActive ? <DownWardArrowSvg /> : <ArrowSvg />}
        </div>
      </div>
    </div>
  );
};

export default ConservationButton;
