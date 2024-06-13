import { useEffect, useState, useMemo } from 'react';
import targetBarStyle from './TreeTargetBar.module.scss';
import TargetsModal from './microComponents/TargetsModal';
import { useMyForestV2 } from '../../../common/Layout/MyForestContextV2';
import EmptyProgress from './microComponents/EmptyProgress';
import Skeleton from 'react-loading-skeleton';
import ForestProgressItem from './microComponents/ForestProgressItem';

interface TargetProps {
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
}: TargetProps) => {
  const {
    contributionsResult,
    treeTarget,
    restoreTarget,
    treeChecked,
    restoreChecked,
    conservTarget,
    conservChecked,
  } = useMyForestV2();

  const conditionsToShowBar = (
    target: number,
    checked: boolean,
    treesDonated: number
  ): boolean => {
    if (treesDonated > 0 || (target > 0 && checked)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {conditionsToShowBar(treeTarget, treeChecked, treesDonated) && (
        <ForestProgressItem
          handleOpen={handleOpen}
          dataType={'treesPlanted'}
          target={treeTarget}
          gift={contributionsResult?.stats.treesDonated.received ?? 0}
          personal={contributionsResult?.stats.treesDonated.personal ?? 0}
          checked={treeChecked}
        />
      )}
      {conditionsToShowBar(restoreTarget, restoreChecked, areaRestored) && (
        <ForestProgressItem
          handleOpen={handleOpen}
          dataType={'areaRestored'}
          target={restoreTarget}
          gift={contributionsResult?.stats.areaRestoredInM2.received ?? 0}
          personal={contributionsResult?.stats.areaRestoredInM2.personal ?? 0}
          checked={restoreChecked}
        />
      )}
      {conditionsToShowBar(conservTarget, conservChecked, areaConserved) && (
        <ForestProgressItem
          handleOpen={handleOpen}
          dataType={'areaConserved'}
          target={conservTarget}
          gift={contributionsResult?.stats.areaConservedInM2.received ?? 0}
          personal={contributionsResult?.stats.areaRestoredInM2.personal ?? 0}
          checked={conservChecked}
        />
      )}
    </>
  );
};

const ForestProgress = () => {
  const [open, setOpen] = useState(false);
  const [enableTarget, setEnableTarget] = useState(false);
  const handleOpen = () => setOpen(true);
  const {
    treeTarget,
    conservTarget,
    restoreTarget,
    isLoading,
    contributionsResult,
  } = useMyForestV2();

  const treesDonated = useMemo(
    () =>
      (contributionsResult?.stats.treesDonated.received ?? 0) +
      (contributionsResult?.stats.treesDonated.personal ?? 0),
    [contributionsResult]
  );

  const areaRestored = useMemo(
    () =>
      (contributionsResult?.stats.areaRestoredInM2.received ?? 0) +
      (contributionsResult?.stats.areaRestoredInM2.personal ?? 0),
    [contributionsResult]
  );

  const areaConserved = useMemo(
    () =>
      (contributionsResult?.stats.areaConservedInM2.received ?? 0) +
      (contributionsResult?.stats.areaConservedInM2.personal ?? 0),
    [contributionsResult]
  );

  const checkCondition = useMemo(
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

  useEffect(() => {
    setEnableTarget(checkCondition);
  }, [checkCondition, treeTarget, restoreTarget, conservTarget]);

  return (
    <>
      {isLoading ? (
        <Skeleton height={84} />
      ) : (
        <div className={targetBarStyle.targetMainContainer}>
          {enableTarget ? (
            <EmptyProgress handleOpen={handleOpen} />
          ) : (
            <ProgressBars
              handleOpen={handleOpen}
              treesDonated={treesDonated}
              areaRestored={areaRestored}
              areaConserved={areaConserved}
            />
          )}

          <TargetsModal open={open} setOpen={setOpen} />
        </div>
      )}
    </>
  );
};

export default ForestProgress;
