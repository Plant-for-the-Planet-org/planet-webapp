import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import styles from './AccountHeader.module.scss';
import i18next from '../../../../../i18n';
import { UserPropsContext } from '../UserPropsContext';
import Settings from '../../../../../public/assets/images/icons/userProfileIcons/Settings';
import SettingsModal from '../../../user/UserProfile/components/SettingsModal';
import BackButton from '../../../../../public/assets/images/icons/BackButton';

const { useTranslation } = i18next;

interface Props {
  title: string;
  page: string;
}

export default function NewAccountHeader({ title, page }: Props): ReactElement {
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
    <div className={styles.headerContainer}>
      <div className={styles.navigationContainer}>
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
      <div id="title" className={styles.titleContainer}>
        <div className={styles.title}>{title}</div>
      </div>
      <div className={styles.menuContainer}>
        {menuItems.map((item: any) => {
          if (item === 'manage-projects') {
            if (userprofile?.type === 'tpo')
              return (
                <div
                  className={styles.menuItem}
                  onClick={() => handleNavClick(item)}
                >
                  {t(item)}
                  {page === item ? (
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
                {page === item ? (
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
  );
}
