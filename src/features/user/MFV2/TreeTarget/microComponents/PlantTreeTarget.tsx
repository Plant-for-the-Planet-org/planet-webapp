import EditTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/EditTargetIcon';
import TreeTargetPlantedTrees from '../../../../../../public/assets/images/icons/Mfv2/TreeTargetPlantedTrees';
import targetBarStyle from '../TreeTargetBar.module.scss';
import themeProperties from '../../../../../theme/themeProperties';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { useTranslations } from 'next-intl';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { useMemo } from 'react';

interface EditButtonProps {
  handleOpen: () => void;
  treeTarget: number;
}
interface TargetBarProps {
  treeTarget: number;
  treePlanted: number;
  calculatePercentage: number;
  giftsReceivedCount: number | undefined;
}

interface PlantTreeTargetProps {
  handleOpen: () => void;
}

const EditButton = ({ handleOpen, treeTarget }: EditButtonProps) => {
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
  treeTarget,
  treePlanted,
  calculatePercentage,
  giftsReceivedCount,
}: TargetBarProps) => {
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
                className={targetBarStyle.targetCompleteBar}
              ></div>
              <div
                style={{
                  width: `${
                    treeTarget > 0 && treePlanted < treeTarget
                      ? 100 - calculatePercentage
                      : 0
                  }%`,
                }}
                className={targetBarStyle.targetBar}
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

const PlantTreeTarget = ({ handleOpen }: PlantTreeTargetProps) => {
  const { treePlanted, contributionsResult } = useMyForestV2();
  const { user } = useUserProps();
  const treeTarget = user?.targets.treesDonated;
  const giftsReceivedCount = contributionsResult?.stats.giftsReceivedCount;

  const calculatePercentage = useMemo(() => {
    if (treeTarget > 0) {
      const percentageOfTreePlanted =
        (Math.round(treePlanted) / treeTarget) * 100;
      return percentageOfTreePlanted;
    } else {
      return 0;
    }
  }, [treeTarget, treePlanted]);

  return (
    <div className={targetBarStyle.targetMainContainerTreeTarget}>
      <EditButton handleOpen={handleOpen} treeTarget={treeTarget} />
      <TreeTargetBar
        treeTarget={treeTarget}
        treePlanted={treePlanted}
        calculatePercentage={Number(calculatePercentage.toFixed(1))}
        giftsReceivedCount={giftsReceivedCount}
      />
    </div>
  );
};

export default PlantTreeTarget;
