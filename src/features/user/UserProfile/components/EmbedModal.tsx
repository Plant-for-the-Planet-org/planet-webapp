import { Modal, Snackbar } from '@material-ui/core';
import React, { ReactElement } from 'react';
import styles from '../styles/EmbedModal.module.scss';
import i18next from '../../../../../i18n';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useRouter } from 'next/router';
import MuiAlert from '@material-ui/lab/Alert';
import { ThemeContext } from '../../../../theme/themeContext';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';

interface Props {
  embedModalOpen: boolean;
  setEmbedModalOpen: Function;
}

const { useTranslation } = i18next;

export default function EmbedModal({
  embedModalOpen,
  setEmbedModalOpen,
}: Props) {
  const { t, ready } = useTranslation(['editProfile']);

  const [isPrivate, setIsPrivate] = React.useState(false);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [severity, setSeverity] = React.useState('success');
  const [snackbarMessage, setSnackbarMessage] = React.useState('OK');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const router = useRouter();
  // This effect is used to get and update UserInfo if the isAuthenticated changes

  const { user, contextLoaded, token } = React.useContext(UserPropsContext);

  React.useEffect(() => {
    if (user && user.isPrivate) {
      setIsPrivate(true);
    }
  }, [user]);

  const handleToggleChange = (e: any) => {
    setIsPrivate(!e.target.checked);
  };

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const saveProfile = async () => {
    setIsUploadingData(true);
    const bodyToSend = {
      isPrivate: false,
    };
    if (contextLoaded && token) {
      try {
        putAuthenticatedRequest(`/app/profile`, bodyToSend, token)
          .then((res) => {
            setSeverity('success');
            setSnackbarMessage(ready ? t('editProfile:profileSaved') : '');
            setEmbedModalOpen(false);
            setIsUploadingData(false);
            router.push(
              `${process.env.WIDGET_URL}?user=${user.id}&tenantkey=${process.env.TENANTID}`
            );
          })
          .catch((error) => {
            setSeverity('error');
            setSnackbarMessage(ready ? t('editProfile:profileSaveFailed') : '');
            handleSnackbarOpen();
            setIsUploadingData(false);
            console.log(error);
          });
      } catch (e) {
        setSeverity('error');
        setSnackbarMessage(ready ? t('editProfile:profileSaveFailed') : '');
        handleSnackbarOpen();
        setIsUploadingData(false);
      }
    }
  };

  // React.useEffect(() => {
  //     console.log(isPrivate);
  // }, [isPrivate]);
  const { theme } = React.useContext(ThemeContext);

  return (
    <>
      <Modal
        className={'modalContainer' + ' ' + theme}
        open={embedModalOpen}
        hideBackdrop
      >
        <div className={styles.modal}>
          <div className={styles.headerDiv}>
            <div className={styles.editProfileText}>
              {' '}
              <b> {t('editProfile:changeAccountToPublic')} </b>
            </div>
            <div className={styles.accountPrivacyChangeText}>
              {t('editProfile:accountPrivacyChangeText')}
            </div>
          </div>
          {/* <div className={styles.isPrivateAccountDiv}>
                        <div>
                            <div className={styles.mainText}>
                                {t('editProfile:publicAccount')}
                            </div>
                        </div>
                        <ToggleSwitch
                            checked={!isPrivate}
                            onChange={handleToggleChange}
                        />
                    </div> */}
          <div
            className={styles.formFieldLarge}
            style={{ justifyContent: 'center' }}
          >
            <button
              id={'editProfileSaveProfile'}
              className={styles.saveButton}
              onClick={() => saveProfile()}
            >
              {isUploadingData ? (
                <div className={styles.spinner}></div>
              ) : (
                t('editProfile:continue')
              )}
            </button>
            <button
              id={'editProfileSaveProfile'}
              className={styles.cancelButton}
              onClick={() => setEmbedModalOpen(false)}
            >
              {t('editProfile:cancel')}
            </button>
          </div>
        </div>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={severity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
