import progressBarStyle from '../ForestProgressBar.module.scss';
import { BarsProps } from '../ForestProgressItem';

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
      className={`${progressBarStyle.personalPercentageBar} personalPercentageBar`}
    ></div>
  );
};

export default PersonalPercentageBar;
