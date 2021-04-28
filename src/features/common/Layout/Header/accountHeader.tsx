import React,{ useEffect } from 'react';
import styles from './Header.module.scss';
import { useRouter } from 'next/router';

import Settings from '../../../../../public/assets/images/icons/userProfileIcons/Settings';
import SettingsModal from '../../../user/UserProfile/components/SettingsModal';
import { useAuth0 } from '@auth0/auth0-react';
import { getRequest, getAccountInfo } from '../../../../utils/apiRequests/api';
import {
  setUserExistsInDB,
  removeUserExistsInDB,
  getLocalUserInfo,
  removeLocalUserInfo,
} from '../../../../utils/auth0/localStorageUtils';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import i18next from '../../../../../i18n'
const { useTranslation } = i18next;

export default function AcountHeader(props: any) {
  const [userprofile, setUserprofile] = React.useState();
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
  const logoutUser = () => {
    removeLocalUserInfo();
    logout({ returnTo: `${process.env.NEXTAUTH_URL}/` });
  }

  React.useEffect(() => {
    async function loadUserData() {
      if (typeof Storage !== 'undefined') {
        let token = null;
        if (isAuthenticated) {
          token = await getAccessTokenSilently();
        }
        if (!isLoading && token) {
          try {
            const res = await getAccountInfo(token)
            if (res.status === 200) {
              const resJson = await res.json();
              setUserprofile(resJson);
            } else if (res.status === 303) {
              // if 303 -> user doesn not exist in db
              setUserExistsInDB(false)
              if (typeof window !== 'undefined') {
                router.push('/complete-signup');
              }
            } else if (res.status === 401) {
              // in case of 401 - invalid token: signIn()
              logoutUser();
              removeUserExistsInDB()
              loginWithRedirect({redirectUri:`${process.env.NEXTAUTH_URL}/login`, ui_locales: localStorage.getItem('language') || 'en' });
            } else {
              // any other error
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          loginWithRedirect({
            redirectUri: `${process.env.NEXTAUTH_URL}/account/history`,
            ui_locales: localStorage.getItem('language') || 'en',
          });
        }
      }
    }

    // ready is for router, loading is for session
    if (!isLoading) {
      loadUserData();
    }
  }, [ isLoading, isAuthenticated]);
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
