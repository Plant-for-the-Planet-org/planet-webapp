import { useState, useMemo } from 'react';
import style from './ForestProgressBar.module.scss';
import TargetsModal from './TargetsModal';
import { useMyForestV2 } from '../../../common/Layout/MyForestContextV2';
import EmptyProgress from './EmptyProgress';
import ForestProgressItem from './ForestProgressItem';

interface ProgressBarsProps {
  handleOpen: () => void;
  treesDonated: number;
  areaRestored: number;
  areaConserved: number;
}

const ProgressBars = ({
  handleOpen,
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
          handleOpen={handleOpen}
          dataType={'treesPlanted'}
          target={treeTarget}
          gift={contributionsResult?.stats.treesDonated.received ?? 0}
          personal={contributionsResult?.stats.treesDonated.personal ?? 0}
        />
      )}
      {shouldShowBar(restoreTarget, areaRestored) && (
        <ForestProgressItem
          handleOpen={handleOpen}
          dataType={'areaRestored'}
          target={restoreTarget}
          gift={contributionsResult?.stats.areaRestoredInM2.received ?? 0}
          personal={contributionsResult?.stats.areaRestoredInM2.personal ?? 0}
        />
      )}
      {shouldShowBar(conservTarget, areaConserved) && (
        <ForestProgressItem
          handleOpen={handleOpen}
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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
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

  const disableProgress = useMemo(
    () =>
      treesDonated === 0 &&
      treeTarget === 0 &&
      areaRestored === 0 &&
      restoreTarget === 0 &&
      conservTarget === 0 &&
      areaConserved === 0,
    [
      treesDonated,
      treeTarget,
      areaRestored,
      restoreTarget,
      conservTarget,
      areaConserved,
    ]
  );

  const progressBarsProps = {
    handleOpen,
    treesDonated,
    areaRestored,
    areaConserved,
  };
  return (
    <div className={style.targetMainContainer}>
      {!disableProgress ? (
        <EmptyProgress handleOpen={handleOpen} />
      ) : (
        <ProgressBars {...progressBarsProps} />
      )}

      <TargetsModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default ForestProgress;
