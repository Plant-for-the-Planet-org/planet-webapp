import { useEffect, useState } from 'react';
import PlantTreeProgressBar from './microComponents/PlantTreeBar';
import ConservAreaProgressBar from './microComponents/ConservAreaBar';
import RestoreAreaProgressBar from './microComponents/RestoreAreaBar';
import targetBarStyle from './TreeTargetBar.module.scss';
import TargetsModal from './microComponents/TargetModal';
import { useMyForestV2 } from '../../../common/Layout/MyForestContextV2';
import EmptyProgress from './microComponents/EmptyProgress';
import Skeleton from 'react-loading-skeleton';

interface TargetProps {
  handleOpen: () => void;
}

const ProgressBars = ({ handleOpen }: TargetProps) => {
  const {
    conservArea,
    restoredTree,
    treePlanted,
    treeTarget,
    conservTarget,
    restoreTarget,
    treeChecked,
    restoreChecked,
    conservChecked,
  } = useMyForestV2();

  return (
    <>
      {(treePlanted > 0 || (treeTarget > 0 && treeChecked)) && (
        <PlantTreeProgressBar handleOpen={handleOpen} />
      )}
      {(restoredTree > 0 || (restoreTarget > 0 && restoreChecked)) && (
        <RestoreAreaProgressBar handleOpen={handleOpen} />
      )}
      {(conservArea > 0 || (conservTarget > 0 && conservChecked)) && (
        <ConservAreaProgressBar handleOpen={handleOpen} />
      )}
    </>
  );
};

const ForestProgress = () => {
  const [open, setOpen] = useState(false);
  const [enableTarget, setEnableTarget] = useState(false);
  const handleOpen = () => setOpen(true);
  const {
    conservArea,
    restoredTree,
    treePlanted,
    treeTarget,
    conservTarget,
    restoreTarget,
    isLoading,
  } = useMyForestV2();

  const checkCondition = () =>
    treePlanted === 0 &&
    treeTarget === 0 &&
    restoredTree === 0 &&
    restoreTarget === 0 &&
    conservTarget === 0 &&
    conservArea === 0;
  useEffect(() => {
    setEnableTarget(checkCondition());
  }, [
    conservArea,
    restoredTree,
    treePlanted,
    treeTarget,
    conservTarget,
    restoreTarget,
  ]);

  return (
    <>
      {isLoading ? (
        <Skeleton height={84} />
      ) : (
        <div className={targetBarStyle.targetMainContainer}>
          {enableTarget ? (
            <EmptyProgress handleOpen={handleOpen} />
          ) : (
            <ProgressBars handleOpen={handleOpen} />
          )}

          <TargetsModal open={open} setOpen={setOpen} />
        </div>
      )}
    </>
  );
};

export default ForestProgress;
