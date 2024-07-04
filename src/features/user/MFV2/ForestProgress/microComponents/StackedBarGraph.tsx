import styles from '../ForestProgress.module.scss';
import { ProgressDataProps } from './ProgressData';

export type StackedBarGraphProps = Omit<ProgressDataProps, 'dataType'>;

const StackedBarGraph = ({
  personalSegmentPercentage,
  giftSegmentPercentage,
  gift,
  personal,
  target,
}: StackedBarGraphProps) => {
  const calculateTotalPercentage = () => {
    if (target <= 0) return null;

    const totalPercentage = ((gift + personal) / target) * 100;
    return Number.isInteger(totalPercentage)
      ? totalPercentage
      : Number(totalPercentage.toFixed(1));
  };

  const totalAchievedPercentage = calculateTotalPercentage();

  return (
    <div className={styles.graphMainContainer}>
      <div className={styles.barContainer}>
        <div
          style={{
            width: `${personalSegmentPercentage}%`,
          }}
          className={styles.personalPercentageBar}
        ></div>
        <div
          style={{
            width: `${giftSegmentPercentage}%`,
          }}
          className={styles.giftPercentageBar}
        ></div>
      </div>
      {totalAchievedPercentage !== null && (
        <div>{`${totalAchievedPercentage}%`}</div>
      )}
    </div>
  );
};

export default StackedBarGraph;
