import RestoredTreeTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/RestoredTreeTargetIcon';
import targetBarStyle from '../TreeTargetBar.module.scss';
import { useMemo } from 'react';
import EditTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/EditTargetIcon';
import { useTranslations } from 'next-intl';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { calculatePercentage } from '../../../../../utils/myForestV2Utils';
import themeProperties from '../../../../../theme/themeProperties';
import { useRouter } from 'next/router';
interface EditButtonProps {
  handleOpen: () => void;
}

interface RestoreTargetBarProps {
  giftPercentage: number;
  personalPercentage: number;
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
  giftPercentage,
  personalPercentage,
  giftsReceivedCount,
}: RestoreTargetBarProps) => {
  const tProfile = useTranslations('Profile');
  const { restoredTree, restoreTarget, restoreChecked, contributionsResult } =
    useMyForestV2();
  const giftReceived =
    contributionsResult?.stats.areaRestoredInM2.received ?? 0;
  return (
    <div className={targetBarStyle.targetSubContainer}>
      <div className={targetBarStyle.statisticsContainer}>
        <div className={targetBarStyle.iconContainerRestoreArea}>
          <RestoredTreeTargetIcon width={19} />
        </div>
        <div className={targetBarStyle.targetStatisticsContainer}>
          <div className={targetBarStyle.stat}>
            {restoreTarget > 0 && restoreChecked
              ? tProfile('progressBar.restoreWithTarget', {
                  count:
                    restoredTree !== Math.floor(restoredTree)
                      ? restoredTree.toFixed(1)
                      : restoredTree,
                  unit:
                    restoreTarget !== Math.floor(restoreTarget)
                      ? restoreTarget.toFixed(1)
                      : restoreTarget,
                })
              : tProfile('progressBar.restoreWithoutTarget', {
                  unit:
                    restoredTree !== Math.floor(restoredTree)
                      ? restoredTree.toFixed(1)
                      : restoredTree,
                })}
          </div>
          <div className={targetBarStyle.barContainer}>
            <div className={targetBarStyle.barSubContainerRestoreArea}>
              <div
                style={{
                  width: `${personalPercentage}%`,
                  borderTopRightRadius: `${
                    giftPercentage !== 0 || restoreTarget > restoredTree ? 0 : 5
                  }px`,
                  borderBottomRightRadius: `${
                    giftPercentage !== 0 || restoreTarget > restoredTree ? 0 : 5
                  }px`,
                }}
                className={targetBarStyle.restoredTargetCompleteBar}
              ></div>
              <div
                style={{
                  width: `${giftPercentage}%`,
                  borderTopRightRadius: `${
                    restoreTarget > giftReceived ? 0 : 5
                  }px`,
                  borderBottomRightRadius: `${
                    restoreTarget > giftReceived ? 0 : 5
                  }px`,
                  borderTopLeftRadius: `${personalPercentage === 0 ? 5 : 0}px`,
                  borderBottomLeftRadius: `${
                    personalPercentage === 0 ? 5 : 0
                  }px`,
                }}
                className={targetBarStyle.restoreTargetBar}
              ></div>
            </div>
            <div>
              {restoreTarget > 0 && `${giftPercentage + personalPercentage}%`}
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
  const { asPath } = useRouter();
  const giftsReceived =
    contributionsResult?.stats.areaRestoredInM2.received ?? 0;
  const personal = contributionsResult?.stats.areaRestoredInM2.personal ?? 0;

  const _calculatePercentage = useMemo(
    () => calculatePercentage(restoreTarget, giftsReceived, personal),
    [restoreTarget, restoredTree]
  );

  return (
    <div className={targetBarStyle.targetMainContainerRestoreArea}>
      {asPath === '/en/profile/mfv2' && <EditButton handleOpen={handleOpen} />}

      <RestoreTargetBar
        giftPercentage={Number(_calculatePercentage.giftPercentage.toFixed(1))}
        personalPercentage={Number(
          _calculatePercentage.personalPercentage.toFixed(1)
        )}
        giftsReceivedCount={Number(giftsReceived?.toFixed(1))}
      />
    </div>
  );
};

export default RestoreAreaBar;
