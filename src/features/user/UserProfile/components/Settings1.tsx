import React from 'react'
import styles from '../styles/SettingsModal.module.scss';
import i18next from '../../../../../i18n';
import EditProfileModal from '../components/EditProfileModal';

export default function Settings1({
  userType,
  userprofile,
  settingsModalOpen,
  handleSettingsModalClose,
  editProfileModalOpen,
  handleEditProfileModalClose,
  handleEditProfileModalOpen,
  changeForceReload,
  forceReload,
}) {
    const {useTranslation} = i18next;
    const {t} = useTranslation(['me', 'common', 'editProfile']);
    return (
        <div className={styles.modal}>
            {
              userType == 'tpo' && 
              <a href={`#projectsContainer`} onClick={handleSettingsModalClose} className={styles.settingsItem}> {t('me:settingManageProject')} </a>
            }
            <div className={styles.settingsItem} 
            onClick={handleEditProfileModalOpen}
            > {t('editProfile:edit')} </div>
            {/*  <div className={styles.settingsItem}> Change Password </div>
            <div className={styles.settingsItem}> Change Email </div>
            <div className={styles.settingsItem}> Embed Widget </div> */}
            <div
              className={styles.settingsItem}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  router.push(`/logout`);
                }
              }
              }
              >
              <b>{t('me:logout')} </b>
            </div>
            <div
              className={styles.settingsItem}
              onClick={handleSettingsModalClose}
            >
              <div className={styles.cancelText}> {t('common:cancel')}</div>
            </div>
            <EditProfileModal
            userprofile={userprofile}
            editProfileModalOpen={editProfileModalOpen}
            handleEditProfileModalClose={handleEditProfileModalClose}
            handleEditProfileModalOpen={handleEditProfileModalOpen}
            changeForceReload={changeForceReload}
            forceReload={forceReload}
          />
        </div>
    )
}
