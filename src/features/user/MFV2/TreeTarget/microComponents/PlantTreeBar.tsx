import EditTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/EditTargetIcon';
import TreeTargetPlantedTrees from '../../../../../../public/assets/images/icons/Mfv2/TreeTargetPlantedTrees';
import targetBarStyle from '../TreeTargetBar.module.scss';
import themeProperties from '../../../../../theme/themeProperties';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { useTranslations } from 'next-intl';
import { calculatePercentage } from '../../../../../utils/myForestV2Utils';
import { useMemo } from 'react';
import { useRouter } from 'next/router';

interface EditButtonProps {
  handleOpen: () => void;
}
export interface TargetBarProps {
  giftPercentage: number;
  personalPercentage: number;
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
  giftPercentage,
  personalPercentage,
  giftsReceivedCount,
}: TargetBarProps) => {
  const { treePlanted, treeTarget, treeChecked, contributionsResult } =
    useMyForestV2();
  const tProfile = useTranslations('Profile');
  const giftReceived = contributionsResult?.stats.treesDonated.received;
  const personal = contributionsResult?.stats.treesDonated.personal;

  const treePlantedProgress = () => {
    if (personal !== undefined && giftReceived !== undefined) {
      if (treeTarget > personal) {
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
      if (treeTarget > giftReceived) {
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
        <div className={targetBarStyle.iconContainerTreeTarget}>
          <TreeTargetPlantedTrees width={19} />
        </div>
        <div className={targetBarStyle.targetStatisticsContainer}>
          <div className={targetBarStyle.stat}>
            {treeTarget > 0 && treeChecked
              ? tProfile('progressBar.treeWithTarget', {
                  count: treePlanted.toFixed(1),
                  total: treeTarget.toFixed(1),
                })
              : tProfile('progressBar.treeWithoutTarget', {
                  count: treePlanted.toFixed(1),
                })}
          </div>
          <div className={targetBarStyle.barContainer}>
            <div className={targetBarStyle.barSubContainerTreeTarget}>
              <div
                style={{
                  width: `${treePlantedProgress()}%`,
                  borderTopRightRadius: `${
                    personalPercentage && treeChecked && giftPercentage === 0
                      ? 5
                      : 0
                  }px`,
                  borderBottomRightRadius: `${
                    personalPercentage && treeChecked && giftPercentage === 0
                      ? 5
                      : 0
                  }px`,
                }}
                className={targetBarStyle.treeTargetCompleteBar}
              ></div>
              <div
                style={{
                  width: `${giftReceiveProgress()}%`,
                  borderTopRightRadius: `${
                    giftPercentage &&
                    giftReceived !== undefined &&
                    treeTarget < giftReceived
                      ? 5
                      : 0
                  }px`,
                  borderBottomRightRadius: `${
                    giftPercentage &&
                    giftReceived !== undefined &&
                    treeTarget < giftReceived
                      ? 5
                      : 0
                  }px`,
                  borderTopLeftRadius: `${personalPercentage === 0 ? 5 : 0}px`,
                  borderBottomLeftRadius: `${
                    personalPercentage === 0 ? 5 : 0
                  }px`,
                }}
                className={targetBarStyle.treeTargetBar}
              ></div>
            </div>
            <div>
              {treeTarget > 0 &&
                treeChecked &&
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

const PlantTreeBar = ({ handleOpen }: EditButtonProps) => {
  const { asPath } = useRouter();

  const { contributionsResult, treeTarget } = useMyForestV2();
  const giftsReceivedCount = contributionsResult?.stats.treesDonated.received;

  const _calculatePercentage = useMemo(
    () =>
      calculatePercentage(
        treeTarget,
        contributionsResult?.stats.treesDonated.received,
        contributionsResult?.stats.treesDonated.personal
      ),
    [treeTarget, contributionsResult]
  );
  return (
    <div className={targetBarStyle.targetMainContainerTreeTarget}>
      {asPath === '/en/profile/mfv2' && <EditButton handleOpen={handleOpen} />}

      <TreeTargetBar
        giftPercentage={Number(_calculatePercentage.giftPercentage.toFixed(1))}
        personalPercentage={Number(
          _calculatePercentage.personalPercentage.toFixed(1)
        )}
        giftsReceivedCount={Number(giftsReceivedCount?.toFixed(1))}
      />
    </div>
  );
};

export default PlantTreeBar;
