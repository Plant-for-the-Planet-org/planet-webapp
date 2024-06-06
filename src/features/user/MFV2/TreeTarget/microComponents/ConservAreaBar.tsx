import ConservedAreaTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/ConservAreaTargetIcon';
import targetBarStyle from '../TreeTargetBar.module.scss';
import EditTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/EditTargetIcon';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { useTranslations } from 'next-intl';
import { calculatePercentage } from '../../../../../utils/myForestV2Utils';
import { useMemo } from 'react';
import themeProperties from '../../../../../theme/themeProperties';
import { useRouter } from 'next/router';

interface ConservTargetBarProps {
  giftPercentage: number;
  personalPercentage: number;
  giftsReceivedCount: number | undefined;
}

interface EditButtonProps {
  handleOpen: () => void;
}

const EditButton = ({ handleOpen }: EditButtonProps) => {
  const { conservTarget } = useMyForestV2();
  const tProfile = useTranslations('Profile');
  const { mediumBlue } = themeProperties;
  return (
    <div className={targetBarStyle.editTargetButtonContainer}>
      <button
        className={targetBarStyle.editTargetContainer}
        onClick={handleOpen}
      >
        <EditTargetIcon width={9} color={`${mediumBlue}`} />
        <p className={targetBarStyle.conservTargetLabel}>
          {conservTarget > 0
            ? tProfile('progressBar.editTarget')
            : tProfile('progressBar.setTarget')}
        </p>
      </button>
    </div>
  );
};

const ConservTargetBar = ({
  giftPercentage,
  personalPercentage,
  giftsReceivedCount,
}: ConservTargetBarProps) => {
  const tProfile = useTranslations('Profile');
  const { conservTarget, conservArea, conservChecked, contributionsResult } =
    useMyForestV2();
  const giftReceived =
    contributionsResult?.stats.areaConservedInM2.received ?? 0;

  return (
    <div className={targetBarStyle.targetSubContainer}>
      <div className={targetBarStyle.statisticsContainer}>
        <div className={targetBarStyle.iconContainerConservArea}>
          <ConservedAreaTargetIcon width={19} />
        </div>
        <div className={targetBarStyle.targetStatisticsContainer}>
          <div className={targetBarStyle.stat}>
            {conservTarget > 0 && conservChecked
              ? tProfile('progressBar.conservWithTarget', {
                  count:
                    conservArea !== Math.floor(conservArea)
                      ? conservArea.toFixed(1)
                      : conservArea,
                  unit:
                    conservTarget !== Math.floor(conservTarget)
                      ? conservTarget.toFixed(1)
                      : conservTarget,
                })
              : tProfile('progressBar.conservWithoutTarget', {
                  unit:
                    conservArea !== Math.floor(conservArea)
                      ? conservArea.toFixed(1)
                      : conservArea,
                })}
          </div>
          <div className={targetBarStyle.barContainer}>
            <div className={targetBarStyle.barSubContainerRestoreArea}>
              <div
                style={{
                  width: `${personalPercentage}%`,
                  borderTopRightRadius: `${
                    giftPercentage !== 0 || conservTarget > conservArea ? 0 : 5
                  }px`,
                  borderBottomRightRadius: `${
                    giftPercentage !== 0 || conservTarget > conservArea ? 0 : 5
                  }px`,
                }}
                className={targetBarStyle.conservTargetCompleteBar}
              ></div>
              <div
                style={{
                  width: `${giftPercentage}%`,
                  borderTopRightRadius: `${
                    conservTarget > giftReceived ? 0 : 5
                  }px`,
                  borderBottomRightRadius: `${
                    conservTarget > giftReceived ? 0 : 5
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
              {conservTarget > 0 &&
                conservChecked &&
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

interface ConservAreaTargetProp {
  handleOpen: () => void;
}

const ConservAreaTarget = ({ handleOpen }: ConservAreaTargetProp) => {
  const { contributionsResult, conservTarget } = useMyForestV2();
  const { asPath } = useRouter();
  const giftsReceivedCount =
    contributionsResult?.stats.areaConservedInM2.received;
  const personal = contributionsResult?.stats.areaConservedInM2.personal;
  const _calculatePercentage = useMemo(
    () => calculatePercentage(conservTarget, giftsReceivedCount, personal),
    [conservTarget, contributionsResult]
  );

  return (
    <div className={targetBarStyle.targetMainContainerConservArea}>
      {asPath === '/en/profile/mfv2' && <EditButton handleOpen={handleOpen} />}

      <ConservTargetBar
        giftPercentage={Number(_calculatePercentage.giftPercentage.toFixed(1))}
        personalPercentage={Number(
          _calculatePercentage.personalPercentage.toFixed(1)
        )}
        giftsReceivedCount={Number(giftsReceivedCount?.toFixed(1))}
      />
    </div>
  );
};

export default ConservAreaTarget;
