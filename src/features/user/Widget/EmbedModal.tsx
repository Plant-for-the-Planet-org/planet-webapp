import type { SyntheticEvent } from 'react';
import type { APIError, User } from '@planet-sdk/common';

import { useState, useContext } from 'react';
import { Modal, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import styles from './EmbedModal.module.scss';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { ThemeContext } from '../../../theme/themeContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';
import { useAuthStore, useUserStore } from '../../../stores';

interface Props {
  embedModalOpen: boolean;
  setEmbedModalOpen: Function;
}

type ProfileStatusApiPayload = {
  isPrivate: boolean;
};
export default function EmbedModal({
  embedModalOpen,
  setEmbedModalOpen,
}: Props) {
  const t = useTranslations('EditProfile');
  const { setErrors } = useContext(ErrorHandlingContext);
  const router = useRouter();
  const { putApiAuthenticated } = useApi();
  // local state
  const [isUploadingData, setIsUploadingData] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  //store: state
  const isAuthReady = useAuthStore(
    (state) => state.token !== null && state.isAuthResolved
  );
  //store: action
  const setUserProfile = useUserStore((state) => state.setUserProfile);

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (event?: SyntheticEvent, reason?: string) => {
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
    if (isAuthReady) {
      try {
        const res = await putApiAuthenticated<User>('/app/profile', {
          payload,
        });
        handleSnackbarOpen();
        setEmbedModalOpen(false);
        setIsUploadingData(false);
        setUserProfile(res);
      } catch (err) {
        setIsUploadingData(false);
        setErrors(handleError(err as APIError));
      }
    }
  };

  const { theme } = useContext(ThemeContext);

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
            severity="success"
          >
            {t('profileSaved')}
          </Alert>
        </div>
      </Snackbar>
    </>
  );
}
