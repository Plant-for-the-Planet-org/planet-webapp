import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/SettingsModal.module.scss';
import i18next from '../../../../../i18n/server';
import EditProfileModal from './EditProfileModal';

export default function SettingsContainer({
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
  const { useTranslation } = i18next;
  const { t } = useTranslation(['me', 'common', 'editProfile']);
  const router = useRouter();
  return (
    <div
      className={styles.modal}
      style={{
        top: window.screen.width <= 768 && userType == 'tpo' ? '10px' : null,
      }}
    >
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
      <div className={styles.settingsItem} onClick={handleEditProfileModalOpen}>
        {' '}
        {t('editProfile:edit')}{' '}
      </div>
      {/*  <div className={styles.settingsItem}> Change Password </div>
            <div className={styles.settingsItem}> Change Email </div>
            <div className={styles.settingsItem}> Embed Widget </div> */}
      <div
        className={styles.settingsItem}
        onClick={() => {
          if (typeof window !== 'undefined') {
            router.push(`/logout`);
          }
        }}
      >
        <b>{t('me:logout')} </b>
      </div>
      <div className={styles.settingsItem} onClick={handleSettingsModalClose}>
        <div className={styles.cancelText}> {t('common:cancel')}</div>
      </div>
      <EditProfileModal
        userprofile={userprofile}
        editProfileModalOpen={editProfileModalOpen}
        handleEditProfileModalClose={handleEditProfileModalClose}
        handleEditProfileModalOpen={handleEditProfileModalOpen}
        changeForceReload={changeForceReload}
        forceReload={forceReload}
        handleSettingsModalClose={handleSettingsModalClose}
      />
    </div>
  );
}
