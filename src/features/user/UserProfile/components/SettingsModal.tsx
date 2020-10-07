import React from 'react';
import { signIn, signOut, useSession, getSession } from 'next-auth/client';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/SettingsModal.module.scss';
import Close from '../../../../assets/images/icons/headerIcons/close';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import EditProfileModal from '../components/EditProfileModal';

export default function SettingsModal({
  userprofile,
  settingsModalOpen,
  handleSettingsModalClose,
  editProfileModalOpen,
  handleEditProfileModalClose,
  handleEditProfileModalOpen,
}: any) {
  return (
    <>
      <Modal
        className={styles.modalContainer}
        open={settingsModalOpen}
        onClose={handleSettingsModalClose}
        closeAfterTransition
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={settingsModalOpen}>
          <div className={styles.modal}>
            <div className={styles.settingsItem}> Manage Projects </div>
            <div className={styles.settingsItem} onClick={handleEditProfileModalOpen}> Edit Profile </div>
            <div className={styles.settingsItem}> Change Password </div>
            <div className={styles.settingsItem}> Change Email </div>
            <div className={styles.settingsItem}> Embed Widget </div>
            <div className={styles.settingsItem} onClick={() => signOut({ callbackUrl: '/' })}>
              <b> Logout </b>
            </div>
            <div
              className={styles.settingsItem}
              onClick={handleSettingsModalClose}
            >
              <div className={styles.cancelText}> Cancel</div>
            </div>
          </div>
        </Fade>
      </Modal>

      <EditProfileModal
        userprofile={userprofile}
        editProfileModalOpen={editProfileModalOpen}
        handleEditProfileModalClose={handleEditProfileModalClose}
        handleEditProfileModalOpen={handleEditProfileModalOpen}
      />
    </>
  );
}
