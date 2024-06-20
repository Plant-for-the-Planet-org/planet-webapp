import {
  TreesPlantedIcon,
  AreaRestoredIcon,
  ConservedAreaIcon,
} from '../../../../../../public/assets/images/icons/ProgressBarIcons';
import { ProgressDataType } from '../ForestProgressItem';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import styles from '../ForestProgress.module.scss';
import StackedBarGraph from './StackedBarGraph';

export interface ProgressDataProps {
  giftPercentage: number;
  personalPercentage: number;
  gift: number;
  personal: number;
  dataType: ProgressDataType;
  target: number;
}

const ForestProgressIcon = ({ dataType }: { dataType: ProgressDataType }) => {
  switch (dataType) {
    case 'treesPlanted':
      return <TreesPlantedIcon width={19} />;
    case 'areaRestored':
      return <AreaRestoredIcon width={17} />;
    case 'areaConserved':
      return <ConservedAreaIcon width={13} />;
  }
};

const ProgressData = ({
  giftPercentage,
  personalPercentage,
  gift,
  personal,
  dataType,
  target,
}: ProgressDataProps) => {
  const tProfile = useTranslations('Profile.progressBar');
  const totalAchievment = gift + personal;
  const graphLabel = useMemo(() => {
    const isTargetSet = target > 0;
    const targetAchievedUnit = Number.isInteger(totalAchievment)
      ? totalAchievment
      : totalAchievment.toFixed(1);

    switch (dataType) {
      case 'treesPlanted':
        return isTargetSet
          ? tProfile('treePlantedAgainstTarget', {
              count: targetAchievedUnit,
              total: target,
            })
          : tProfile('treePlanted', {
              count: targetAchievedUnit,
            });

      case 'areaRestored':
        return isTargetSet
          ? tProfile('restoredAreaAgainstTarget', {
              count: targetAchievedUnit,
              unit: target,
            })
          : tProfile('restoredArea', {
              unit: targetAchievedUnit,
            });

      case 'areaConserved':
        return isTargetSet
          ? tProfile('conservedAreaAgainstTarget', {
              count: targetAchievedUnit,
              unit: target,
            })
          : tProfile('conservedArea', {
              unit: targetAchievedUnit,
            });

      default:
        return '';
    }
  }, [dataType, target]);

  const graphProps = {
    personalPercentage,
    giftPercentage,
    gift,
    personal,
    target,
  };

  const isGiftAvailable = gift !== undefined && gift > 0;
  const giftLabel = tProfile('totalGiftFromCommunity', {
    quantity: gift,
  });

  return (
    <div className={styles.progressContainer}>
      <div className={styles.statisticsMainContainer}>
        <div className={styles.iconContainer}>
          <ForestProgressIcon dataType={dataType} />
        </div>
        <div className={styles.statisticsContainer}>
          <div className={styles.stat}>{graphLabel}</div>
          <StackedBarGraph {...graphProps} />
          {isGiftAvailable && (
            <div className={styles.communityReceived}>{giftLabel}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressData;
