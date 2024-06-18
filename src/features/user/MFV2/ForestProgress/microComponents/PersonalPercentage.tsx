import styles from '../ForestProgress.module.scss';
import { BarsProps } from './Bars';

const PersonalPercentageBar = ({
  personalPercentage,
  giftPercentage,
  target,
  gift,
  personal,
}: BarsProps) => {
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
