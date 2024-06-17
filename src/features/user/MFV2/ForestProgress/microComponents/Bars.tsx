import PersonalPercentageBar from './PersonalPercentage';
import GiftPercentageBar from './GiftPercentageBar';
import progressBarStyle from '../ForestProgress.module.scss';
import { ProgressDataProps } from './ProgressData';

export type BarsProps = Omit<ProgressDataProps, 'dataType'>;

const Bars = ({
  personalPercentage,
  giftPercentage,
  gift,
  personal,
  target,
}: BarsProps) => {
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
    <div className={progressBarStyle.barMainContainer}>
      <div className={progressBarStyle.barContainer}>
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

export default Bars;
