import React, { useEffect } from 'react';
import styles from './AccountHeader.module.scss';
import { useRouter } from 'next/router';
import Settings from '../../../../../public/assets/images/icons/userProfileIcons/Settings';
import SettingsModal from '../../../user/UserProfile/components/SettingsModal';
import { useAuth0 } from '@auth0/auth0-react';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import i18next from '../../../../../i18n';
import { UserPropsContext } from '../UserPropsContext';
const { useTranslation } = i18next;

export default function AcountHeader(props: any) {
  const { userprofile } = React.useContext(UserPropsContext);
  const [forceReload, changeForceReload] = React.useState(false);
  const { t } = useTranslation(['me']);

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

  const menuItems = [
    'history',
    'treemapper',
    'manage-projects',
    'register-trees',
  ];

  const handleNavClick = (item: any) => {
    if (item === 'manage-projects') {
      router.push(`/t/${userprofile.slug}#projectsContainer`, undefined, {
        shallow: true,
      });
    } else {
      router.push(`/account/${item}`, undefined, { shallow: true });
    }
  };
  return (
    <>
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
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div className={styles.accountsTitleContainer}>
              <div className={styles.accountsTitle}>{props.pageTitle}</div>
            </div>
          </div>
          <div className={styles.navbar}>
            {menuItems.map((item: any) => {
              if (item === 'manage-projects') {
                if (userprofile?.type === 'tpo')
                  return (
                    <div
                      className={styles.menuItem}
                      onClick={() => handleNavClick(item)}
                    >
                      {t(item)}
                      {props.page === item ? (
                        <div className={styles.active}></div>
                      ) : (
                        <div className={styles.inActive}></div>
                      )}
                    </div>
                  );
              } else {
                return (
                  <div
                    className={styles.menuItem}
                    onClick={() => handleNavClick(item)}
                  >
                    {t(item)}
                    {props.page === item ? (
                      <div className={styles.active}></div>
                    ) : (
                      <div className={styles.inActive}></div>
                    )}
                  </div>
                );
              }
            })}
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
    </>
  );
}
