import React from 'react';
import styles from '../styles/SettingsModal.module.scss';
import Close from '../../../../../public/assets/images/icons/headerIcons/close';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useRouter } from 'next/router';
import Fade from '@material-ui/core/Fade';
import EditProfileModal from '../components/EditProfileModal';
import i18next from '../../../../../i18n';
import { useAuth0 } from '@auth0/auth0-react';
import { removeLocalUserInfo } from '../../../../utils/auth0/localStorageUtils';

const { useTranslation } = i18next;
export default function SettingsModal({
  userType,
  userprofile,
  settingsModalOpen,
  handleSettingsModalClose,
  editProfileModalOpen,
  handleEditProfileModalClose,
  handleEditProfileModalOpen,
  changeForceReload,
  forceReload,
}: any) {
  const router = useRouter();
  const { t, ready } = useTranslation(['me', 'common', 'editProfile']);
  const {
    logout,
  } = useAuth0();

  const logoutUser = () => {
    removeLocalUserInfo();
    logout({ returnTo: `${process.env.NEXTAUTH_URL}/` });
  }
  return ready ? (
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
            {
              userType == 'tpo' &&
              <a href={`#projectsContainer`} onClick={handleSettingsModalClose} className={styles.settingsItem}> {t('me:settingManageProject')} </a>
            }
            <div className={styles.settingsItem} onClick={handleEditProfileModalOpen}> {t('editProfile:edit')} </div>
            {/*  <div className={styles.settingsItem}> Change Password </div>
            <div className={styles.settingsItem}> Change Email </div>
            <div className={styles.settingsItem}> Embed Widget </div> */}
            <button id={'settingsLogOut'}
              className={styles.settingsItem}
              onClick={logoutUser}>
              <b>{t('me:logout')} </b>
            </button>
            <button id={'SettingsItem'}
              className={styles.settingsItem}
              onClick={handleSettingsModalClose}
            >
              <div className={styles.cancelText}> {t('common:cancel')}</div>
            </button>
          </div>
        </Fade>
      </Modal>

      <EditProfileModal
        userprofile={userprofile}
        editProfileModalOpen={editProfileModalOpen}
        handleEditProfileModalClose={handleEditProfileModalClose}
        handleEditProfileModalOpen={handleEditProfileModalOpen}
        changeForceReload={changeForceReload}
        forceReload={forceReload}
      />
    </>
  ) : null;
}
