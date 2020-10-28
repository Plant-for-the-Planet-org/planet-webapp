import React from 'react';
import styles from '../styles/RedeemModal.module.scss';
import {useSession} from 'next-auth/client';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';

export default function AddTargetModal({
  userprofile,
  addTargetModalOpen,
  handleAddTargetModalClose,
  changeForceReload,
  forceReload
}: any) {
    const [target, setTarget] = React.useState(0);
    const [session, loading] = useSession();

    const apiCallChangeTarget = () => {
        console.log('here', target)
        handleAddTargetModalClose()
    }
  return (
    <Modal
      className={styles.modalContainer}
      open={addTargetModalOpen}
      onClose={handleAddTargetModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={addTargetModalOpen}>
        <div className={styles.modal}>
          <h4>
            <b> Add Target </b>
          </h4>
          <div className={styles.inputField}>
            <MaterialTextField 
                placeholder="100000" 
                InputProps={{ inputProps: { min: 0 } }}
                label="" 
                type="number" 
                onChange={(e) => setTarget(e.target.value)}
                variant="outlined" />
          </div>
          <div className={styles.continueButton} onClick={()=> apiCallChangeTarget()}>Save</div>
        </div>
      </Fade>
    </Modal>
  );
}
