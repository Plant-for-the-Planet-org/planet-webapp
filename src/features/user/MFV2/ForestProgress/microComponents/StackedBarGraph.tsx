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

  const hasDecimalPart = Number.isInteger(totalAchievedPercentage);

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
            hasDecimalPart
              ? totalAchievedPercentage.toFixed(1)
              : totalAchievedPercentage
          }%`}
      </div>
    </div>
  );
};

export default StackedBarGraph;
