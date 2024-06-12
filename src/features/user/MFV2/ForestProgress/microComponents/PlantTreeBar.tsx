import EditTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/EditTargetIcon';
import TreesPlantedIcon from '../../../../../../public/assets/images/icons/Mfv2/TreesPlantedIcon';
import targetBarStyle from '../TreeTargetBar.module.scss';
import themeProperties from '../../../../../theme/themeProperties';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { useTranslations } from 'next-intl';
import { getAchievedTarget } from '../../../../../utils/myForestV2Utils';
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
  const giftReceived = contributionsResult?.stats.treesDonated.received ?? 0;

  return (
    <div className={targetBarStyle.targetSubContainer}>
      <div className={targetBarStyle.statisticsContainer}>
        <div className={targetBarStyle.iconContainerTreeTarget}>
          <TreesPlantedIcon width={19} />
        </div>
        <div className={targetBarStyle.targetStatisticsContainer}>
          <div className={targetBarStyle.stat}>
            {treeTarget > 0 && treeChecked
              ? tProfile('progressBar.treeWithTarget', {
                  count:
                    treePlanted !== Math.floor(treePlanted)
                      ? treePlanted.toFixed(1)
                      : treePlanted,
                  total:
                    treeTarget !== Math.floor(treeTarget)
                      ? treeTarget.toFixed(1)
                      : treeTarget,
                })
              : tProfile('progressBar.treeWithoutTarget', {
                  count:
                    treePlanted !== Math.floor(treePlanted)
                      ? treePlanted.toFixed(1)
                      : treePlanted,
                })}
          </div>
          <div className={targetBarStyle.barContainer}>
            <div className={targetBarStyle.barSubContainerTreeTarget}>
              <div
                style={{
                  width: `${personalPercentage}%`,
                  borderTopRightRadius: `${
                    giftPercentage !== 0 || treeTarget > treePlanted ? 0 : 5
                  }px`,
                  borderBottomRightRadius: `${
                    giftPercentage !== 0 || treeTarget > treePlanted ? 0 : 5
                  }px`,
                }}
                className={targetBarStyle.treeTargetCompleteBar}
              ></div>
              <div
                style={{
                  width: `${giftPercentage}%`,
                  borderTopRightRadius: `${
                    treeTarget > giftReceived ? 0 : 5
                  }px`,
                  borderBottomRightRadius: `${
                    treeTarget > giftReceived ? 0 : 5
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
              {treeTarget > 0 && `${giftPercentage + personalPercentage}%`}
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
  const giftsReceivedCount =
    contributionsResult?.stats.treesDonated.received ?? 0;
  const personal = contributionsResult?.stats.treesDonated.personal ?? 0;

  const _calculatePercentage = useMemo(
    () => getAchievedTarget(treeTarget, giftsReceivedCount, personal),
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
