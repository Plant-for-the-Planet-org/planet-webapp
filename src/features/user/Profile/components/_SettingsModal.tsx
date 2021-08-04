import React from 'react';
import styles from '../styles/SettingsModal.module.scss';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useRouter } from 'next/router';
import Fade from '@material-ui/core/Fade';
import EditProfileModal from '../components/EditProfileModal';
import i18next from '../../../../../i18n';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { deleteAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import EmbedModal from './EmbedModal';
import { ThemeContext } from '../../../../theme/themeContext';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';

const { useTranslation } = i18next;
export default function SettingsModal({
  settingsModalOpen,
  handleSettingsModalClose,
  editProfileModalOpen,
  handleEditProfileModalClose,
  handleEditProfileModalOpen,
}: any) {
  const { user, logoutUser } = React.useContext(UserPropsContext);

  const router = useRouter();
  const { t, ready } = useTranslation(['me', 'common', 'editProfile']);

  const [deleteModalOpen, setdeleteModalOpen] = React.useState(false);
  const handledeleteModalClose = () => {
    setdeleteModalOpen(false);
  };
  const handledeleteModalOpen = () => {
    setdeleteModalOpen(!deleteModalOpen);
  };

  const [embedModalOpen, setEmbedModalOpen] = React.useState(false);

  const embedModalProps = { embedModalOpen, setEmbedModalOpen, user };

  const handleEmbedModalOpen = () => {
    if (user.isPrivate) {
      setEmbedModalOpen(true);
    } else {
      router.push(
        `${process.env.WIDGET_URL}?user=${user.id}&tenantkey=${process.env.TENANTID}`
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
              {user.type == 'tpo' && (
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
              {user.type !== 'tpo' && (
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
                onClick={() => logoutUser()}
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
        editProfileModalOpen={editProfileModalOpen}
        handleEditProfileModalClose={handleEditProfileModalClose}
      />
      <DeleteModal
        deleteModalOpen={deleteModalOpen}
        handledeleteModalClose={handledeleteModalClose}
      />
      <EmbedModal {...embedModalProps} />
    </>
  ) : null;
}

function DeleteModal({ deleteModalOpen, handledeleteModalClose }: any) {
  const { user, token, logoutUser } = React.useContext(UserPropsContext);
  const { t, ready } = useTranslation(['me', 'common', 'editProfile']);
  const handleChange = (e) => {
    e.preventDefault();
  };

  const [isUploadingData, setIsUploadingData] = React.useState(false);

  const [canDeleteAccount, setcanDeleteAccount] = React.useState(false);

  const handleDeleteAccount = () => {
    setIsUploadingData(true);
    deleteAuthenticatedRequest('/app/profile', token).then((res) => {
      if (res !== 404) {
        logoutUser();
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
              email: user.email,
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
