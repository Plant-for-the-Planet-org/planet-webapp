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
  const giftReceived = contributionsResult?.stats.treesDonated.received;
  const personal = contributionsResult?.stats.treesDonated.personal;
  const restoreProgress = () => {
    if (personal !== undefined && giftReceived !== undefined) {
      if (restoreTarget > personal) {
        return personalPercentage;
      } else {
        if (giftReceived === 0) {
          return 100;
        } else {
          return personalPercentage;
        }
      }
    }
  };

  const giftReceiveProgress = () => {
    if (giftReceived !== undefined && personal !== undefined) {
      if (restoreTarget > giftReceived) {
        return giftPercentage;
      } else {
        if (personal === 0) {
          return 100;
        } else {
          return giftPercentage;
        }
      }
    }
  };

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
                  count: restoredTree.toFixed(1),
                  unit: restoreTarget.toFixed(1),
                })
              : tProfile('progressBar.restoreWithoutTarget', {
                  unit: restoredTree.toFixed(1),
                })}
          </div>
          <div className={targetBarStyle.barContainer}>
            <div className={targetBarStyle.barSubContainerRestoreArea}>
              <div
                style={{
                  width: `${restoreProgress()}%`,
                  borderTopRightRadius: `${
                    personalPercentage && restoreChecked && giftPercentage === 0
                      ? 5
                      : 0
                  }px`,
                  borderBottomRightRadius: `${
                    personalPercentage && restoreChecked && giftPercentage === 0
                      ? 5
                      : 0
                  }px`,
                }}
                className={targetBarStyle.restoredTargetCompleteBar}
              ></div>
              <div
                style={{
                  width: `${giftReceiveProgress()}%`,
                  borderTopRightRadius: `${
                    (giftPercentage &&
                      giftReceived !== undefined &&
                      restoreTarget < giftReceived) ||
                    restoreTarget === 0
                      ? 5
                      : 0
                  }px`,
                  borderBottomRightRadius: `${
                    (giftPercentage &&
                      giftReceived !== undefined &&
                      restoreTarget < giftReceived) ||
                    restoreTarget === 0
                      ? 5
                      : 0
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
              {restoreTarget > 0 &&
                restoreChecked &&
                `${giftPercentage + personalPercentage}%`}
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
  const giftsReceivedCount =
    contributionsResult?.stats.areaRestoredInM2.received;

  const _calculatePercentage = useMemo(
    () =>
      calculatePercentage(
        restoreTarget,
        contributionsResult?.stats.areaRestoredInM2.received,
        contributionsResult?.stats.areaRestoredInM2.personal
      ),
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
        giftsReceivedCount={Number(giftsReceivedCount?.toFixed(1))}
      />
    </div>
  );
};

export default RestoreAreaBar;
