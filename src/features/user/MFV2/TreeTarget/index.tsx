import { Modal } from '@mui/material';
import { useState } from 'react';
import PlantTreeTarget from './microComponents/PlantTreeTarget';
import targetBarStyle from './TreeTargetBar.module.scss';
import TreeTargetModal from './microComponents/TreeTargetModal';
import RestoreTreeTargetModal from './microComponents/RestoreTreeTargetModal';
import ConservAreaTargetModal from './microComponents/ConservAreaTargetModal';
import ConservAreaTarget from './microComponents/ConservAreaTarget';
import RestoreAreaTarget from './microComponents/RestoreTreeTarget';

const TreeTarget = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className={targetBarStyle.targetMainContainer}>
      <PlantTreeTarget handleOpen={handleOpen} />
      <RestoreAreaTarget handleOpen={handleOpen} />
      <ConservAreaTarget handleOpen={handleOpen} />
      <Modal open={open} onClose={handleClose}>
        <div className={targetBarStyle.targetModalMainContainer}>
          <div className={targetBarStyle.setTargetLabel}>Set targets</div>
          <div className={targetBarStyle.targetModalSubConatiner}>
            <TreeTargetModal />
            <ConservAreaTargetModal />
            <RestoreTreeTargetModal />
          </div>
          <button className={targetBarStyle.saveButton}>Save</button>
        </div>
      </Modal>
    </div>
  );
};

export default TreeTarget;
