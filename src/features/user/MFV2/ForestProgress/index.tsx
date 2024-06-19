import { useState, useMemo, useEffect } from 'react';
import styles from './ForestProgress.module.scss';
import TargetsModal from './TargetsModal';
import { useMyForestV2 } from '../../../common/Layout/MyForestContextV2';
import EmptyProgress from './EmptyProgress';
import ForestProgressItem from './ForestProgressItem';
import { ProfilePageType } from '../../../common/types/myForestv2';
import { checkProgressEnabled } from '../../../../utils/myForestV2Utils';
import { ProgressData } from '../../../common/types/myForestv2';

type ForestProgressProp = {
  profilePageType: ProfilePageType;
};
interface ProgressBarsProps {
  handleEditTargets: () => void;
  progressData: ProgressData;
  treeTarget: number;
  restoreTarget: number;
  conservTarget: number;
  profilePageType: ProfilePageType;
}

const ProgressBars = ({
  handleEditTargets,
  progressData,
  treeTarget,
  restoreTarget,
  conservTarget,
  profilePageType,
}: ProgressBarsProps) => {
  const { contributionStats } = useMyForestV2();

  const shouldShowBar = (target: number, contributedUnits: number): boolean =>
    contributedUnits > 0 || target > 0;
  const { treesDonated, areaRestored, areaConserved } = progressData;
  return (
    <>
      {shouldShowBar(treeTarget, treesDonated) && (
        <ForestProgressItem
          handleEditTargets={handleEditTargets}
          dataType={'treesPlanted'}
          target={treeTarget}
          gift={contributionStats?.treesDonated.received ?? 0}
          personal={contributionStats?.treesDonated.personal ?? 0}
          profilePageType={profilePageType}
        />
      )}
      {shouldShowBar(restoreTarget, areaRestored) && (
        <ForestProgressItem
          handleEditTargets={handleEditTargets}
          dataType={'areaRestored'}
          target={restoreTarget}
          gift={contributionStats?.areaRestoredInM2.received ?? 0}
          personal={contributionStats?.areaRestoredInM2.personal ?? 0}
          profilePageType={profilePageType}
        />
      )}
      {shouldShowBar(conservTarget, areaConserved) && (
        <ForestProgressItem
          handleEditTargets={handleEditTargets}
          dataType={'areaConserved'}
          target={conservTarget}
          gift={contributionStats?.areaConservedInM2.received ?? 0}
          personal={contributionStats?.areaConservedInM2.personal ?? 0}
          profilePageType={profilePageType}
        />
      )}
    </>
  );
};

const ForestProgress = ({ profilePageType }: ForestProgressProp) => {
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const handleEditTargets = () => setIsEditingTargets(true);

  const { userInfo, contributionStats } = useMyForestV2();

  const aggregateProgressData = () => {
    const treesDonated =
      (contributionStats?.treesDonated.personal ?? 0) +
      (contributionStats?.treesDonated.received ?? 0) +
      (contributionStats?.treesRegistered ?? 0);
    const areaRestored =
      (contributionStats?.areaRestoredInM2.personal ?? 0) +
      (contributionStats?.areaRestoredInM2.received ?? 0);
    const areaConserved =
      (contributionStats?.areaConservedInM2.personal ?? 0) +
      (contributionStats?.areaConservedInM2.received ?? 0);
    return { treesDonated, areaRestored, areaConserved };
  };

  const progressData = useMemo(aggregateProgressData, [contributionStats]);
  const treeTarget = userInfo?.targets.treesDonated ?? 0;
  const restoreTarget = userInfo?.targets.areaRestored ?? 0;
  const conservTarget = userInfo?.targets.areaConserved ?? 0;

  const [isProgressEnabled, setIsProgressEnabled] = useState(
    checkProgressEnabled(progressData, treeTarget, restoreTarget, conservTarget)
  );

  useEffect(() => {
    setIsProgressEnabled(
      checkProgressEnabled(
        progressData,
        treeTarget,
        restoreTarget,
        conservTarget
      )
    );
  }, [treeTarget, restoreTarget, conservTarget, progressData]);

  const progressBarsProps = {
    handleEditTargets,
    progressData,
    treeTarget,
    restoreTarget,
    conservTarget,
    profilePageType,
  };

  const targets = {
    treeTarget,
    restoreTarget,
    conservTarget,
  };
  return (
    <div className={styles.progressSection}>
      {isProgressEnabled ? (
        <ProgressBars {...progressBarsProps} />
      ) : (
        <EmptyProgress handleSetTargets={handleEditTargets} />
      )}

      <TargetsModal
        open={isEditingTargets}
        setOpen={setIsEditingTargets}
        {...targets}
      />
    </div>
  );
};

export default ForestProgress;
