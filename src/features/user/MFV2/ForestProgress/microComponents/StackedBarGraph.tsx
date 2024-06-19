import styles from '../ForestProgress.module.scss';
import { ProgressDataProps } from './ProgressData';

export type StackedBarGraphProps = Omit<
  ProgressDataProps,
  'dataType' | 'gift' | 'personal'
>;

const StackedBarGraph = ({
  personalPercentage,
  giftPercentage,
  target,
}: StackedBarGraphProps) => {
  const totalAchievedPercentage = giftPercentage + personalPercentage;

  const isInteger = Number.isInteger(totalAchievedPercentage);

  return (
    <div className={styles.graphMainContainer}>
      <div className={styles.barContainer}>
        <div
          style={{
            width: `${personalPercentage}%`,
          }}
          className={styles.personalPercentageBar}
        ></div>
        <div
          style={{
            width: `${giftPercentage}%`,
          }}
          className={styles.giftPercentageBar}
        ></div>
      </div>
      <div>
        {target > 0 &&
          `${
            isInteger
              ? totalAchievedPercentage
              : totalAchievedPercentage.toFixed(1)
          }%`}
      </div>
    </div>
  );
};

export default StackedBarGraph;
