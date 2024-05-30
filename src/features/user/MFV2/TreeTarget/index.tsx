import { useState } from 'react';
import PlantTreeTarget from './microComponents/PlantTreeTarget';
import targetBarStyle from './TreeTargetBar.module.scss';
import ConservAreaTarget from './microComponents/ConservAreaTarget';
import RestoreAreaTarget from './microComponents/RestoreTreeTarget';
import TargetModal from './microComponents/TargetModal';
import { useMyForestV2 } from '../../../common/Layout/MyForestContextV2';
import { useUserProps } from '../../../common/Layout/UserPropsContext';

const Target = ({ handleOpen }) => {
  const { conservArea, restoredTree, treePlanted } = useMyForestV2();
  const { user } = useUserProps();
  const treeTarget = user?.targets.treesDonated;
  const restoreTarget = user?.targets.areaRestored;
  const conservTarget = user?.targets.areaConserved;

  return (
    <>
      {(treePlanted > 0 || treeTarget > 0) && (
        <PlantTreeTarget handleOpen={handleOpen} />
      )}
      {(restoredTree > 0 || restoreTarget > 0) && (
        <RestoreAreaTarget handleOpen={handleOpen} />
      )}
      {(conservArea > 0 || conservTarget > 0) && (
        <ConservAreaTarget handleOpen={handleOpen} />
      )}
    </>
  );
};

const SetTargets = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <div className={targetBarStyle.targetMainContainer}>
        <Target handleOpen={handleOpen} />
        <TargetModal open={open} handleClose={handleClose} />
      </div>
    </>
  );
};

export default SetTargets;
