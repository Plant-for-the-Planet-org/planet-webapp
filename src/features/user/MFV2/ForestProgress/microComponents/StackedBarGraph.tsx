import PersonalPercentageBar from './PersonalPercentage';
import GiftPercentageBar from './GiftPercentageBar';
import styles from '../ForestProgress.module.scss';
import { ProgressDataProps } from './ProgressData';

export type StackedBarGraphProps = Omit<ProgressDataProps, 'dataType'>;

const StackedBarGraph = ({
  personalPercentage,
  giftPercentage,
  gift,
  personal,
  target,
}: StackedBarGraphProps) => {
  const totalAchievedPercentage = giftPercentage + personalPercentage;

  const hasDecimalPart =
    totalAchievedPercentage !== Math.floor(totalAchievedPercentage);

  const commonProps = {
    personalPercentage,
    giftPercentage,
    gift,
    personal,
    target,
  };
  return (
    <div className={styles.graphMainContainer}>
      <div className={styles.barContainer}>
        <PersonalPercentageBar {...commonProps} />
        <GiftPercentageBar {...commonProps} />
      </div>
      <div>
        {target > 0 &&
          `${
            hasDecimalPart
              ? totalAchievedPercentage.toFixed(1)
              : totalAchievedPercentage
          }%`}
      </div>
    </div>
  );
};

export default StackedBarGraph;
