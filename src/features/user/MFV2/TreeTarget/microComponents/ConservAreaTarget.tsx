import ConservedAreaTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/ConservAreaTargetIcon';
import targetBarStyle from '../TreeTargetBar.module.scss';
import EditTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/EditTargetIcon';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { useTranslations } from 'next-intl';
import { calculatePercentage } from '../../../../../utils/myForestV2Utils';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { useMemo } from 'react';
import { TargetProps } from './PlantTreeTarget';

interface ConservTargetBarProps {
  conservTarget: number;
  conservArea: number;
  calculatePercentage: number;
  giftsReceivedCount: number | undefined;
}

interface EditButtonProps {
  handleOpen: () => void;
  conservTarget: number;
}

const EditButton = ({ handleOpen, conservTarget }: EditButtonProps) => {
  const tProfile = useTranslations('Profile');
  return (
    <div className={targetBarStyle.editTargetButtonContainer}>
      <button
        className={targetBarStyle.editTargetContainer}
        onClick={handleOpen}
      >
        <EditTargetIcon width={9} color={'rgba(45, 156, 219, 1)'} />
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
  conservTarget,
  conservArea,
  calculatePercentage,
  giftsReceivedCount,
}: ConservTargetBarProps) => {
  const tProfile = useTranslations('Profile');
  return (
    <div className={targetBarStyle.targetSubContainer}>
      <div className={targetBarStyle.statisticsContainer}>
        <div className={targetBarStyle.iconContainerConservArea}>
          <ConservedAreaTargetIcon width={19} />
        </div>
        <div className={targetBarStyle.targetStatisticsContainer}>
          <div className={targetBarStyle.stat}>
            {conservTarget > 0
              ? tProfile('progressBar.conservWithTarget', {
                  count: conservArea,
                  unit: conservTarget,
                })
              : tProfile('progressBar.conservWithoutTarget', {
                  unit: conservArea,
                })}
          </div>
          <div className={targetBarStyle.barContainer}>
            <div className={targetBarStyle.barSubContainerRestoreArea}>
              <div
                style={{
                  width: `${conservTarget > 0 ? calculatePercentage : 100}%`,
                  borderTopRightRadius: `${
                    conservTarget > 0 && conservArea < conservTarget ? 0 : 5
                  }px`,
                  borderBottomRightRadius: `${
                    conservTarget > 0 && conservArea < conservTarget ? 0 : 5
                  }px`,
                }}
                className={targetBarStyle.conservTargetCompleteBar}
              ></div>
              <div
                style={{
                  width: `${
                    conservTarget > 0 && conservArea < conservTarget
                      ? 100 - calculatePercentage
                      : 0
                  }%`,
                }}
                className={targetBarStyle.conservTargetBar}
              ></div>
            </div>
            <div>
              {conservTarget > 0 &&
                `${conservArea > conservTarget ? 100 : calculatePercentage}%`}
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

const ConservAreaTarget = ({ handleOpen }: TargetProps) => {
  const { conservArea, contributionsResult } = useMyForestV2();
  const { user } = useUserProps();
  const conservTarget = user?.targets.areaConserved;
  const giftsReceivedCount = contributionsResult?.stats.giftsReceivedCount;

  const _calculatePercentage: number = useMemo(
    () => calculatePercentage(conservTarget, conservArea),
    [conservTarget, conservArea]
  );

  return (
    <div className={targetBarStyle.targetMainContainerConservArea}>
      <EditButton handleOpen={handleOpen} conservTarget={conservTarget} />
      <ConservTargetBar
        conservTarget={conservTarget}
        conservArea={conservArea}
        calculatePercentage={Number(_calculatePercentage.toFixed(1))}
        giftsReceivedCount={giftsReceivedCount}
      />
    </div>
  );
};

export default ConservAreaTarget;
