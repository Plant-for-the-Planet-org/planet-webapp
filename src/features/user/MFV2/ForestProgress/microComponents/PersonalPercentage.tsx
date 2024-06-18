import styles from '../ForestProgress.module.scss';
import { StackedBarGraphProps } from './StackedBarGraph';

const PersonalPercentageBar = ({
  personalPercentage,
  giftPercentage,
  target,
  gift,
  personal,
}: StackedBarGraphProps) => {
  const totalAchievment = gift + personal;
  return (
    <div
      style={{
        width: `${personalPercentage}%`,
        borderTopRightRadius: `${
          giftPercentage !== 0 || target > totalAchievment ? 0 : 5
        }px`,
        borderBottomRightRadius: `${
          giftPercentage !== 0 || target > totalAchievment ? 0 : 5
        }px`,
      }}
      className={`${styles.personalPercentageBar} personalPercentageBar`}
    ></div>
  );
};

export default PersonalPercentageBar;
