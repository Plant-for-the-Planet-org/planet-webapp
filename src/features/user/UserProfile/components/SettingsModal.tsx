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
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import BackButton from '../../../../../public/assets/images/icons/BackButton';

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
  const { logout } = useAuth0();

  const [deleteModalOpen, setdeleteModalOpen] = React.useState(false);
  const handledeleteModalClose = () => {
    setdeleteModalOpen(false);
  };
  const handledeleteModalOpen = () => {
    setdeleteModalOpen(!deleteModalOpen);
  };

  const logoutUser = () => {
    removeLocalUserInfo();
    logout({ returnTo: `${process.env.NEXTAUTH_URL}/` });
  };
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
            {userType == 'tpo' && (
              <a
                href={`#projectsContainer`}
                onClick={handleSettingsModalClose}
                className={styles.settingsItem}
              >
                {' '}
                {t('me:settingManageProject')}{' '}
              </a>
            )}
            <div
              className={styles.settingsItem}
              onClick={handleEditProfileModalOpen}
            >
              {' '}
              {t('editProfile:edit')}{' '}
            </div>
            {/*  <div className={styles.settingsItem}> Change Password </div>
            <div className={styles.settingsItem}> Change Email </div>
            <div className={styles.settingsItem}> Embed Widget </div> */}
            <button
              id={'settingsLogOut'}
              className={styles.settingsItem}
              onClick={logoutUser}
            >
              <b>{t('me:logout')} </b>
            </button>
            <button
              id={'settingsDeleteAccount'}
              className={styles.settingsItem}
              onClick={handledeleteModalOpen}
            >
              {t('me:deleteAccount')}
            </button>
            <button
              id={'SettingsItem'}
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
      <DeleteModal
        deleteModalOpen={deleteModalOpen}
        handledeleteModalClose={handledeleteModalClose}
      />
    </>
  ) : null;
}

function DeleteModal({ deleteModalOpen, handledeleteModalClose }) {
  return (
    <Modal
      className={styles.modalContainer}
      open={deleteModalOpen}
      onClose={handledeleteModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={deleteModalOpen}>
        <div className={styles.deleteModal}>
          <p className={styles.deleteModalTitle}>Delete your account</p>
          <p className={styles.deleteModalContent}>
            By clicking delete, I am requesting Plant-for-the-Planet to delete
            all data associated with my Plant-for-the-Planet account in
            accordance with GDPR Act. I understand that donation data may be
            kept for up to eight years. Trees I have registered will not be
            removed from Trillion Tree Counter, however, will be anonymized and
            cannot be associated with a profile again. Any additional data will
            be deleted/anonymised in accordance to the Privacy Policy.
            <br/>
            <br/>
            Alternatively you can mark your profile private by visiting Edit Profile.
            <br/>
            <br/>
            To continue with deletion, please type “Delete My Account”
          </p>

          <MaterialTextField 
              placeholder={'Delete My Account'}
              label={'Delete My Account'}
              type="text"
              onChange={(e) => console.log(e.target.value)}
              variant="outlined"
              style={{marginTop:'20px'}}
              name="addTarget" />

          <div className={styles.deleteButtonContainer}>
          <div onClick={()=>handledeleteModalClose()} className={styles.goBackContainer}>
            <BackButton style={{}} />
            Go Back
          </div>
          <AnimatedButton className={styles.deleteButton}>
            Delete
          </AnimatedButton>
          </div>

          <p className={styles.deleteModalWarning}>
            I also understand that account deletion of example@email.com is irreversible.   
          </p>
        </div>
      </Fade>
    </Modal>
  );
}
