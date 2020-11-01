import React from 'react';
import styles from '../styles/RedeemModal.module.scss';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';

export default function SettingsModal({
  redeemModalOpen,
  handleRedeemModalClose,
}: any) {
  return (
    <Modal
      className={styles.modalContainer}
      open={redeemModalOpen}
      onClose={handleRedeemModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={redeemModalOpen}>
        <div className={styles.modal}>
          <h4>
            <b> Redeem Trees </b>
          </h4>
          <div className={styles.inputField}>
            <MaterialTextField placeholder="pp.eco/XADSA-DS-AS" label="" variant="outlined" />
          </div>
          <div className={styles.continueButton}>Continue</div>
        </div>
      </Fade>
    </Modal>
  );
}
