import { useState } from 'react';
import PlantTreeProgressBar from './microComponents/PlantTreeBar';
import ConservAreaProgressBar from './microComponents/ConservAreaBar';
import RestoreAreaProgressBar from './microComponents/RestoreAreaBar';
import targetBarStyle from './TreeTargetBar.module.scss';
import TargetsModal from './microComponents/TargetModal';
import { useMyForestV2 } from '../../../common/Layout/MyForestContextV2';

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
  } = useMyForestV2();

  return (
    <>
      {(treePlanted > 0 || treeTarget > 0) && (
        <PlantTreeProgressBar handleOpen={handleOpen} />
      )}
      {(restoredTree > 0 || restoreTarget > 0) && (
        <RestoreAreaProgressBar handleOpen={handleOpen} />
      )}
      {(conservArea > 0 || conservTarget > 0) && (
        <ConservAreaProgressBar handleOpen={handleOpen} />
      )}
    </>
  );
};

const BarGraphs = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <div className={targetBarStyle.targetMainContainer}>
        <ProgressBars handleOpen={handleOpen} />
        <TargetsModal open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default BarGraphs;
