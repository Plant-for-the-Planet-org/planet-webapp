import React from 'react';
import styles from '../styles/SettingsModal.module.scss';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useRouter } from 'next/router';
import Fade from '@material-ui/core/Fade';
import EditProfileModal from '../components/EditProfileModal';
import i18next from '../../../../../i18n';
import { useAuth0 } from '@auth0/auth0-react';
import {
  removeLocalUserInfo,
  removeUserExistsInDB,
} from '../../../../utils/auth0/localStorageUtils';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { deleteAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import EmbedModal from './EmbedModal';
import { ThemeContext } from '../../../../theme/themeContext';

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

  const [embedModalOpen, setEmbedModalOpen] = React.useState(false);

  const embedModalProps = { embedModalOpen, setEmbedModalOpen, userprofile };

  const handleEmbedModalOpen = () => {
    if (userprofile.isPrivate) {
      setEmbedModalOpen(true);
    } else {
      router.push(
        `${process.env.WIDGET_URL}?user=${userprofile.id}&tenantkey=${process.env.TENANTID}`
      );
    }
  };

  const { theme } = React.useContext(ThemeContext);

  return ready ? (
    <>
      <Modal
        className={'modalContainer' + ' ' + theme}
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
          <nav className={styles.modal}>
            <ul
              style={{
                listStyle: 'none',
                paddingLeft: '0px',
                textAlign: 'center',
                paddingBottom: '20px',
              }}
            >
              {userType == 'tpo' && (
                <li
                  className={styles.settingsItem}
                  style={{ marginTop: '12px' }}
                >
                  <a
                    href={`#projectsContainer`}
                    onClick={handleSettingsModalClose}
                  >
                    {t('me:settingManageProject')}
                  </a>
                </li>
              )}

              {/*  <div className={styles.settingsItem}> Change Password </div>
            <div className={styles.settingsItem}> Change Email </div> */}
              <li
                className={styles.settingsItem}
                onClick={handleEditProfileModalOpen}
              >
                {' '}
                {t('editProfile:edit')}{' '}
              </li>

              <li
                onClick={() =>
                  router.push('/account/history', undefined, { shallow: true })
                }
                id={'SettingsItem'}
                className={styles.settingsItem}
              >
                {t('me:account')}
              </li>
              <li
                onClick={handleEmbedModalOpen}
                id={'SettingsItem'}
                className={styles.settingsItem}
              >
                {t('me:embedWidget')}
              </li>
              {userType !== 'tpo' && (
                <li
                  id={'settingsDeleteAccount'}
                  className={styles.settingsItem}
                  onClick={handledeleteModalOpen}
                >
                  {t('me:deleteAccount')}
                </li>
              )}
              <li
                id={'settingsLogOut'}
                className={styles.settingsItem}
                onClick={logoutUser}
              >
                <b>{t('me:logout')} </b>
              </li>

              <li
                id={'SettingsItem'}
                className={styles.settingsItem}
                onClick={handleSettingsModalClose}
              >
                <div className={styles.cancelText}> {t('common:cancel')}</div>
              </li>
            </ul>
          </nav>
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
        userprofile={userprofile}
      />
      <EmbedModal {...embedModalProps} />
    </>
  ) : null;
}

function DeleteModal({
  deleteModalOpen,
  handledeleteModalClose,
  userprofile,
}: any) {
  const { t, ready } = useTranslation(['me', 'common', 'editProfile']);
  const handleChange = (e) => {
    e.preventDefault();
  };

  const [isUploadingData, setIsUploadingData] = React.useState(false);

  const { getAccessTokenSilently, isAuthenticated, logout } = useAuth0();

  React.useEffect(() => {
    async function loadFunction() {
      const token = await getAccessTokenSilently();
      setToken(token);
    }
    if (isAuthenticated) {
      loadFunction();
    }
  }, [isAuthenticated]);

  const [token, setToken] = React.useState('');

  const [canDeleteAccount, setcanDeleteAccount] = React.useState(false);

  const handleDeleteAccount = () => {
    setIsUploadingData(true);
    deleteAuthenticatedRequest('/app/profile', token).then((res) => {
      if (res !== 404) {
        removeLocalUserInfo();
        removeUserExistsInDB();
        logout({ returnTo: `${process.env.NEXTAUTH_URL}/` });
      } else {
        console.log(res.errorText);
      }
    });
  };

  const { theme } = React.useContext(ThemeContext);

  return (
    <Modal
      className={'modalContainer' + ' ' + theme}
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
          <p className={styles.deleteModalTitle}>
            {' '}
            {t('common:deleteAccount')}
          </p>
          <p className={styles.deleteModalContent}>
            {t('common:deleteAccountMessage', {
              delete: 'Delete',
            })}
            <br />
            <br />
            {t('common:alternativelyEditProfile')}
          </p>
          <MaterialTextField
            // placeholder={t('common:deleteAccount')}
            label={t('common:deleteAccountLabel', { delete: 'Delete' })}
            type="text"
            variant="outlined"
            style={{ marginTop: '20px' }}
            name="addTarget"
            onCut={handleChange}
            onCopy={handleChange}
            onPaste={handleChange}
            onChange={(e) => {
              if (e.target.value === 'Delete') {
                setcanDeleteAccount(true);
              } else {
                setcanDeleteAccount(false);
              }
            }}
          />
          <p className={styles.deleteConsent}>
            {t('common:deleteAccountConsent')}
          </p>
          <p className={styles.deleteModalWarning}>
            {t('common:deleteIrreversible', {
              email: userprofile.email,
            })}
          </p>

          <div className={styles.deleteButtonContainer}>
            <div
              onClick={() => {
                handledeleteModalClose();
                setcanDeleteAccount(false);
              }}
              className={styles.goBackContainer}
            >
              <p>{t('common:goBack')}</p>
            </div>
            {canDeleteAccount ? (
              <AnimatedButton
                onClick={() => handleDeleteAccount()}
                className={styles.deleteButton}
                style={{
                  backgroundColor: styles.dangerColor,
                  color: styles.light,
                }}
              >
                {isUploadingData ? (
                  <div className={styles.spinner}></div>
                ) : (
                  t('common:delete')
                )}
              </AnimatedButton>
            ) : (
              <AnimatedButton
                className={styles.deleteButton}
                style={{ backgroundColor: '#f2f2f7', color: '#2f3336' }}
              >
                {t('common:delete')}
              </AnimatedButton>
            )}
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
