import { useState } from 'react';
import PlantTreeTarget from './microComponents/PlantTreeTarget';
import targetBarStyle from './TreeTargetBar.module.scss';
import ConservAreaTarget from './microComponents/ConservAreaTarget';
import RestoreAreaTarget from './microComponents/RestoreTreeTarget';
import TargetModal from './microComponents/TargetModal';

const Target = ({ handleOpen }) => {
  return (
    <>
      <PlantTreeTarget handleOpen={handleOpen} />
      <RestoreAreaTarget handleOpen={handleOpen} />
      <ConservAreaTarget handleOpen={handleOpen} />
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
