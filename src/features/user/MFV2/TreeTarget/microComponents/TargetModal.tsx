import { Modal } from '@mui/material';
import TreeTargetModal from './TreeTargetModal';
import ConservAreaTargetModal from './ConservAreaTargetModal';
import RestoreTreeTargetModal from './RestoreTreeTargetModal';
import targetBarStyle from '../TreeTargetBar.module.scss';

const TargetModal = ({ open, handleClose }) => {
  return (
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
  );
};

export default TargetModal;
