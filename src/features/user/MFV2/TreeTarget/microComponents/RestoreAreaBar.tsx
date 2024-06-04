import RestoredTreeTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/RestoredTreeTargetIcon';
import targetBarStyle from '../TreeTargetBar.module.scss';
import { useMemo } from 'react';
import EditTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/EditTargetIcon';
import { useTranslations } from 'next-intl';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { calculatePercentage } from '../../../../../utils/myForestV2Utils';
import themeProperties from '../../../../../theme/themeProperties';
interface EditButtonProps {
  handleOpen: () => void;
}

interface RestoreTargetBarProps {
  calculatePercentage: number;
  giftsReceivedCount: number | undefined;
}

const EditButton = ({ handleOpen }: EditButtonProps) => {
  const { restoreTarget } = useMyForestV2();
  const tProfile = useTranslations('Profile');
  const { electricPurple } = themeProperties;
  return (
    <div className={targetBarStyle.editTargetButtonContainer}>
      <button
        className={targetBarStyle.editTargetContainer}
        onClick={handleOpen}
      >
        <EditTargetIcon width={9} color={`${electricPurple}`} />
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
  calculatePercentage,
  giftsReceivedCount,
}: RestoreTargetBarProps) => {
  const tProfile = useTranslations('Profile');
  const { restoredTree, restoreTarget } = useMyForestV2();
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
                  borderTopLeftRadius: `${restoredTree === 0 ? 5 : 0}px`,
                  borderBottomLeftRadius: `${restoredTree === 0 ? 5 : 0}px`,
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

const RestoreAreaBar = ({ handleOpen }: EditButtonProps) => {
  const { restoredTree, restoreTarget, contributionsResult } = useMyForestV2();
  const giftsReceivedCount = contributionsResult?.stats.giftsReceivedCount;

  const _calculatePercentage: number = useMemo(
    () => calculatePercentage(restoreTarget, restoredTree),
    [restoreTarget, restoredTree]
  );

  return (
    <div className={targetBarStyle.targetMainContainerRestoreArea}>
      <EditButton handleOpen={handleOpen} />
      <RestoreTargetBar
        calculatePercentage={Number(_calculatePercentage.toFixed(1))}
        giftsReceivedCount={giftsReceivedCount}
      />
    </div>
  );
};

export default RestoreAreaBar;
