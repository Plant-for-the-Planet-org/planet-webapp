import type { APIError, User } from '@planet-sdk/common';
import type { AlertColor } from '@mui/lab';

import React from 'react';
import { Modal, Snackbar, styled } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import styles from './EmbedModal.module.scss';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { ThemeContext } from '../../../theme/themeContext';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';

interface Props {
  embedModalOpen: boolean;
  setEmbedModalOpen: Function;
}

const Alert = styled(MuiAlert)(({ theme }) => {
  return {
    backgroundColor: theme.palette.primary.main,
  };
});

type ProfileStatusApiPayload = {
  isPrivate: boolean;
};
export default function EmbedModal({
  embedModalOpen,
  setEmbedModalOpen,
}: Props) {
  const t = useTranslations('EditProfile');
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [severity, setSeverity] = React.useState<AlertColor>('success');
  const [snackbarMessage, setSnackbarMessage] = React.useState('OK');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const router = useRouter();
  const { putApiAuthenticated } = useApi();
  // This effect is used to get and update UserInfo if the isAuthenticated changes

  const { setUser, contextLoaded, token } = useUserProps();

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
    const payload: ProfileStatusApiPayload = {
      isPrivate: false,
    };
    if (contextLoaded && token) {
      try {
        const res = await putApiAuthenticated<User>('/app/profile', {
          payload,
        });
        setSeverity('success');
        setSnackbarMessage(t('profileSaved'));
        handleSnackbarOpen();
        setEmbedModalOpen(false);
        setIsUploadingData(false);
        setUser(res);
      } catch (err) {
        setIsUploadingData(false);
        setErrors(handleError(err as APIError));
      }
    }
  };

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
              <b> {t('changeAccountToPublic')} </b>
            </div>
            <div className={styles.accountPrivacyChangeText}>
              {t('accountPrivacyChangeText')}
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
                t('continue')
              )}
            </button>
            <button
              id={'editProfileSaveProfile'}
              className={styles.cancelButton}
              onClick={() => {
                setEmbedModalOpen(false);
                router.back();
              }}
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <div>
          <Alert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity={severity}
          >
            {snackbarMessage}
          </Alert>
        </div>
      </Snackbar>
    </>
  );
}
