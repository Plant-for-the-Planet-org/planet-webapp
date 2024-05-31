import RestoredTreeTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/RestoredTreeTargetIcon';
import targetBarStyle from '../TreeTargetBar.module.scss';
import { useMemo } from 'react';
import EditTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/EditTargetIcon';
import { useTranslations } from 'next-intl';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { calculatePercentage } from '../../../../../utils/myForestV2Utils';
import { TargetProps } from './PlantTreeTarget';

interface EditButtonProps {
  handleOpen: () => void;
  restoreTarget: number;
}

interface RestoreTargetBarProps {
  restoreTarget: number;
  restoredTree: number;
  calculatePercentage: number;
  giftsReceivedCount: number | undefined;
}

const EditButton = ({ handleOpen, restoreTarget }: EditButtonProps) => {
  const tProfile = useTranslations('Profile');
  return (
    <div className={targetBarStyle.editTargetButtonContainer}>
      <button
        className={targetBarStyle.editTargetContainer}
        onClick={handleOpen}
      >
        <EditTargetIcon width={9} color={'rgba(155, 81, 224, 1)'} />
        <p className={targetBarStyle.restoreTargetLabel}>
          {restoreTarget > 0
            ? tProfile('progressBar.editTarget')
            : tProfile('progressBar.setTarget')}
        </p>
      </button>
    </div>
  );
};

const RestoreTargetBar = ({
  restoreTarget,
  restoredTree,
  calculatePercentage,
  giftsReceivedCount,
}: RestoreTargetBarProps) => {
  const tProfile = useTranslations('Profile');
  return (
    <div className={targetBarStyle.targetSubContainer}>
      <div className={targetBarStyle.statisticsContainer}>
        <div className={targetBarStyle.iconContainerRestoreArea}>
          <RestoredTreeTargetIcon width={19} />
        </div>
        <div className={targetBarStyle.targetStatisticsContainer}>
          <div className={targetBarStyle.stat}>
            {restoreTarget > 0
              ? tProfile('progressBar.restoreWithTarget', {
                  count: restoredTree,
                  unit: restoreTarget,
                })
              : tProfile('progressBar.restoreWithoutTarget', {
                  unit: restoredTree,
                })}
          </div>
          <div className={targetBarStyle.barContainer}>
            <div className={targetBarStyle.barSubContainerRestoreArea}>
              <div
                style={{
                  width: `${restoreTarget > 0 ? calculatePercentage : 100}%`,
                  borderTopRightRadius: `${
                    restoreTarget > 0 && restoredTree < restoreTarget ? 0 : 5
                  }px`,
                  borderBottomRightRadius: `${
                    restoreTarget > 0 && restoredTree < restoreTarget ? 0 : 5
                  }px`,
                }}
                className={targetBarStyle.restoredTargetCompleteBar}
              ></div>
              <div
                style={{
                  width: `${
                    restoreTarget > 0 && restoredTree < restoreTarget
                      ? 100 - calculatePercentage
                      : 0
                  }%`,
                }}
                className={targetBarStyle.restoreTargetBar}
              ></div>
            </div>
            <div>
              {restoreTarget > 0 &&
                `${restoredTree > restoreTarget ? 100 : calculatePercentage}%`}
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

const RestoreAreaTarget = ({ handleOpen }: TargetProps) => {
  const { restoredTree, contributionsResult } = useMyForestV2();
  const { user } = useUserProps();
  const restoreTarget = user?.targets.areaRestored;
  const giftsReceivedCount = contributionsResult?.stats.giftsReceivedCount;

  const _calculatePercentage: number = useMemo(
    () => calculatePercentage(restoreTarget, restoredTree),
    [restoreTarget, restoredTree]
  );

  return (
    <div className={targetBarStyle.targetMainContainerRestoreArea}>
      <EditButton handleOpen={handleOpen} restoreTarget={restoreTarget} />
      <RestoreTargetBar
        restoreTarget={restoreTarget}
        restoredTree={restoredTree}
        calculatePercentage={Number(_calculatePercentage.toFixed(1))}
        giftsReceivedCount={giftsReceivedCount}
      />
    </div>
  );
};

export default RestoreAreaTarget;
