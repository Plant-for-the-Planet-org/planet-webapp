import { useState, useMemo, useEffect } from 'react';
import styles from './ForestProgress.module.scss';
import TargetsModal from './TargetsModal';
import { useMyForestV2 } from '../../../common/Layout/MyForestContextV2';
import EmptyProgress from './EmptyProgress';
import ForestProgressItem from './ForestProgressItem';

interface ProgressBarsProps {
  handleEditTargets: () => void;
  treesDonated: number;
  areaRestored: number;
  areaConserved: number;
}

const ProgressBars = ({
  handleEditTargets,
  treesDonated,
  areaRestored,
  areaConserved,
}: ProgressBarsProps) => {
  const { contributionsResult, treeTarget, restoreTarget, conservTarget } =
    useMyForestV2();

  const shouldShowBar = (target: number, contributedUnits: number): boolean =>
    contributedUnits > 0 || target > 0;

  return (
    <>
      {shouldShowBar(treeTarget, treesDonated) && (
        <ForestProgressItem
          handleEditTargets={handleEditTargets}
          dataType={'treesPlanted'}
          target={treeTarget}
          gift={contributionsResult?.stats.treesDonated.received ?? 0}
          personal={contributionsResult?.stats.treesDonated.personal ?? 0}
        />
      )}
      {shouldShowBar(restoreTarget, areaRestored) && (
        <ForestProgressItem
          handleEditTargets={handleEditTargets}
          dataType={'areaRestored'}
          target={restoreTarget}
          gift={contributionsResult?.stats.areaRestoredInM2.received ?? 0}
          personal={contributionsResult?.stats.areaRestoredInM2.personal ?? 0}
        />
      )}
      {shouldShowBar(conservTarget, areaConserved) && (
        <ForestProgressItem
          handleEditTargets={handleEditTargets}
          dataType={'areaConserved'}
          target={conservTarget}
          gift={contributionsResult?.stats.areaConservedInM2.received ?? 0}
          personal={contributionsResult?.stats.areaConservedInM2.personal ?? 0}
        />
      )}
    </>
  );
};

const ForestProgress = () => {
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const handleEditTargets = () => setIsEditingTargets(true);

  const [isProgressEnabled, setIsProgressEnabled] = useState(false);
  const { treeTarget, conservTarget, restoreTarget, contributionsResult } =
    useMyForestV2();

  const aggregateContributions = () => {
    const treesDonated =
      (contributionsResult?.stats.treesDonated.personal ?? 0) +
      (contributionsResult?.stats.treesDonated.received ?? 0) +
      (contributionsResult?.stats.treesRegistered ?? 0);
    const areaRestored =
      (contributionsResult?.stats.areaRestoredInM2.personal ?? 0) +
      (contributionsResult?.stats.areaRestoredInM2.received ?? 0);
    const areaConserved =
      (contributionsResult?.stats.areaConservedInM2.personal ?? 0) +
      (contributionsResult?.stats.areaConservedInM2.received ?? 0);
    return { treesDonated, areaRestored, areaConserved };
  };

  const contributions = useMemo(aggregateContributions, [contributionsResult]);
  const { treesDonated, areaRestored, areaConserved } = contributions;

  useEffect(() => {
    setIsProgressEnabled(
      !(
        treesDonated === 0 &&
        treeTarget === 0 &&
        areaRestored === 0 &&
        restoreTarget === 0 &&
        conservTarget === 0 &&
        areaConserved === 0
      )
    );
  }, [
    treeTarget,
    treesDonated,
    restoreTarget,
    areaRestored,
    conservTarget,
    areaConserved,
  ]);

  const progressBarsProps = {
    handleEditTargets,
    treesDonated,
    areaRestored,
    areaConserved,
  };
  return (
    <div className={styles.progressSection}>
      {isProgressEnabled ? (
        <ProgressBars {...progressBarsProps} />
      ) : (
        <EmptyProgress handleSetTargets={handleEditTargets} />
      )}

      <TargetsModal open={isEditingTargets} setOpen={setIsEditingTargets} />
    </div>
  );
};

export default ForestProgress;
