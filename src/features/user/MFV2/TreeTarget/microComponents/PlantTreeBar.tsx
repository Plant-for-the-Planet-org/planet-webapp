import EditTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/EditTargetIcon';
import TreeTargetPlantedTrees from '../../../../../../public/assets/images/icons/Mfv2/TreeTargetPlantedTrees';
import targetBarStyle from '../TreeTargetBar.module.scss';
import themeProperties from '../../../../../theme/themeProperties';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { useTranslations } from 'next-intl';
import { calculatePercentage } from '../../../../../utils/myForestV2Utils';
import { useMemo } from 'react';

interface EditButtonProps {
  handleOpen: () => void;
}
export interface TargetBarProps {
  calculatePercentage: number;
  giftsReceivedCount: number | undefined;
}

const EditButton = ({ handleOpen }: EditButtonProps) => {
  const { treeTarget } = useMyForestV2();
  const tProfile = useTranslations('Profile');
  return (
    <div className={targetBarStyle.editTargetButtonContainer}>
      <button
        className={targetBarStyle.editTargetContainer}
        onClick={handleOpen}
      >
        <EditTargetIcon width={9} color={themeProperties.primaryDarkColor} />
        <p className={targetBarStyle.treeTargetLabel}>
          {treeTarget > 0
            ? tProfile('progressBar.editTarget')
            : tProfile('progressBar.setTarget')}
        </p>
      </button>
    </div>
  );
};

const TreeTargetBar = ({
  calculatePercentage,
  giftsReceivedCount,
}: TargetBarProps) => {
  const { treePlanted, treeTarget } = useMyForestV2();
  const tProfile = useTranslations('Profile');
  return (
    <div className={targetBarStyle.targetSubContainer}>
      <div className={targetBarStyle.statisticsContainer}>
        <div className={targetBarStyle.iconContainerTreeTarget}>
          <TreeTargetPlantedTrees width={19} />
        </div>
        <div className={targetBarStyle.targetStatisticsContainer}>
          <div className={targetBarStyle.stat}>
            {treeTarget > 0
              ? tProfile('progressBar.treeWithTarget', {
                  count: treePlanted,
                  total: treeTarget,
                })
              : tProfile('progressBar.treeWithoutTarget', {
                  count: treePlanted,
                })}
          </div>
          <div className={targetBarStyle.barContainer}>
            <div className={targetBarStyle.barSubContainerTreeTarget}>
              <div
                style={{
                  width: `${treeTarget > 0 ? calculatePercentage : 100}%`,
                  borderTopRightRadius: `${
                    treeTarget > 0 && treePlanted < treeTarget ? 0 : 5
                  }px`,
                  borderBottomRightRadius: `${
                    treeTarget > 0 && treePlanted < treeTarget ? 0 : 5
                  }px`,
                }}
                className={targetBarStyle.treeTargetCompleteBar}
              ></div>
              <div
                style={{
                  width: `${
                    treeTarget > 0 && treePlanted < treeTarget
                      ? 100 - calculatePercentage
                      : 0
                  }%`,
                  borderTopLeftRadius: `${treePlanted === 0 ? 5 : 0}px`,
                  borderBottomLeftRadius: `${treePlanted === 0 ? 5 : 0}px`,
                }}
                className={targetBarStyle.treeTargetBar}
              ></div>
            </div>
            <div>
              {treeTarget > 0 &&
                `${treePlanted > treeTarget ? 100 : calculatePercentage}%`}
            </div>
          </div>
          {giftsReceivedCount !== undefined && giftsReceivedCount > 0 && (
            <div className={targetBarStyle.communityReceived}>
              {tProfile('progressBar.totalGiftFromCommunity', {
                quantity: giftsReceivedCount,
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PlantTreeBar = ({ handleOpen }: EditButtonProps) => {
  const { treePlanted, contributionsResult, treeTarget } = useMyForestV2();
  const giftsReceivedCount = contributionsResult?.stats.giftsReceivedCount;

  const _calculatePercentage: number = useMemo(
    () => calculatePercentage(treeTarget, treePlanted),
    [treeTarget, treePlanted]
  );

  return (
    <div className={targetBarStyle.targetMainContainerTreeTarget}>
      <EditButton handleOpen={handleOpen} />
      <TreeTargetBar
        calculatePercentage={Number(_calculatePercentage.toFixed(1))}
        giftsReceivedCount={giftsReceivedCount}
      />
    </div>
  );
};

export default PlantTreeBar;
