import React,{ useEffect } from 'react';
import styles from './Header.module.scss';
import { useRouter } from 'next/router';

import Settings from '../../../../../public/assets/images/icons/userProfileIcons/Settings';
import SettingsModal from '../../../user/UserProfile/components/SettingsModal';
import { useAuth0 } from '@auth0/auth0-react';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import i18next from '../../../../../i18n'
import {UserPropsContext} from '../UserPropsContext';
const { useTranslation } = i18next;

export default function AcountHeader(props: any) {
  const {userprofile} = React.useContext(UserPropsContext);
  const [forceReload, changeForceReload] = React.useState(false);
  const { t } = useTranslation(['me']);

  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    logout
  } = useAuth0();
  const router = useRouter();

  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
  const handleSettingsModalClose = () => {
    setSettingsModalOpen(false);
  };
  const handleSettingsModalOpen = () => {
    setSettingsModalOpen(!settingsModalOpen);
  };
  // editProfile modal  (from settings modal)
  const [editProfileModalOpen, setEditProfileModalOpen] = React.useState(false);
  const handleEditProfileModalClose = () => {
    setEditProfileModalOpen(false);
  };
  const handleEditProfileModalOpen = () => {
    setEditProfileModalOpen(true);
  };
    return (
      <div>
      <div className={styles.headerBG}>
        <div className={styles.accountsHeader}>
          <div className={styles.navContainer}>
            <button
              onClick={() => {
                router.back();
              }}
              className={styles.backButton}
            >
              <BackButton style={{ margin: '0px' }} />
            </button>
            <button
              id={'IndividualProSetting'}
              className={styles.settingsButton}
              onClick={handleSettingsModalOpen}
            >
              <Settings color="white" />
            </button>
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div className={styles.accountsTitleContainer}>
            <div className={styles.accountsTitle}>{props.pageTitle}</div>
          </div>
          </div>
        </div>
      </div>
            {settingsModalOpen && (
        <SettingsModal
          userprofile={userprofile}
          settingsModalOpen={settingsModalOpen}
          handleSettingsModalClose={handleSettingsModalClose}
          editProfileModalOpen={editProfileModalOpen}
          handleEditProfileModalClose={handleEditProfileModalClose}
          handleEditProfileModalOpen={handleEditProfileModalOpen}
          changeForceReload={changeForceReload}
          forceReload={forceReload}
        />
      )}
      </div>
    );
  }
