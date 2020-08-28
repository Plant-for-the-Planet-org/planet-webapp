import React from 'react';
import styles from '../styles/EditProfileModal.module.scss';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

export default function EditProfileModal({
    editProfileModalOpen,
    handleEditProfileModalClose,
}: any) {
  return (
    <Modal
      className={styles.modalContainer}
      open={editProfileModalOpen}
      onClose={handleEditProfileModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={editProfileModalOpen}>
      <div className={styles.modal}>
          <div className={styles.settingsItem} onClick={handleEditProfileModalClose}><p className={styles.cancelText}> Cancel</p> </div>
        </div>
      </Fade>
    </Modal>
  );
}
