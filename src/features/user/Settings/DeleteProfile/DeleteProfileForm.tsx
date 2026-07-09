import type { ChangeEvent } from 'react';
import type { APIError, SerializedError } from '@planet-sdk/common';

import { useState } from 'react';
import styles from './DeleteProfile.module.scss';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import CustomModal from '../../../common/Layout/CustomModal';
import { useTranslations } from 'next-intl';
import { Button, TextField } from '@mui/material';
import StyledForm from '../../../common/Layout/StyledForm';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../../hooks/useApi';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import { useErrorHandlingStore } from '../../../../stores/errorHandlingStore';

export default function DeleteProfileForm() {
  const { user, logoutUser } = useUserProps();
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { deleteApiAuthenticated } = useApi();
  // local state
  const [isUploadingData, setIsUploadingData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); //true when subscriptions are present
  const [canDeleteAccount, setCanDeleteAccount] = useState(false);
  // store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const handleChange = (e: ChangeEvent<{}>) => {
    e.preventDefault();
  };
  const handleDeleteAccount = async () => {
    setIsUploadingData(true);
    try {
      await deleteApiAuthenticated('/app/profile');
      setIsUploadingData(false);
      logoutUser(`${window.location.origin}/`);
    } catch (err) {
      setIsUploadingData(false);
      const serializedErrors = handleError(err as APIError);
      const _serializedErrors: SerializedError[] = [];

      for (const error of serializedErrors) {
        switch (error.message) {
          case 'active_subscriptions':
            setIsModalOpen(true);
            break;

          default:
            _serializedErrors.push(error);
            break;
        }
      }

      setErrors(_serializedErrors);
    }
  };
  const handleSubscriptions = () => {
    setIsModalOpen(false);
    router.push(localizedPath('/profile/recurrency'));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCanDeleteAccount(false);
  };

  return !isModalOpen ? (
    <StyledForm>
      <div className="inputContainer">
        <p>
          {tCommon('deleteAccountMessage', {
            delete: 'Delete',
          })}
        </p>
        <p>{tCommon('alternativelyEditProfile')}</p>
        <TextField
          // placeholder={tCommon('deleteAccount')}
          label={tCommon('deleteAccountLabel', { delete: 'Delete' })}
          type="text"
          variant="outlined"
          name="addTarget"
          onCut={handleChange}
          onCopy={handleChange}
          onPaste={handleChange}
          onChange={(e) => {
            if (e.target.value === 'Delete') {
              setCanDeleteAccount(true);
            } else {
              setCanDeleteAccount(false);
            }
          }}
        ></TextField>
        <p>{tCommon('deleteAccountConsent')}</p>
        <p>
          <strong>{tCommon('deleteCondition')}</strong>
        </p>
        <p className={styles.deleteModalWarning}>
          {tCommon('deleteIrreversible', {
            email: user?.email,
          })}
        </p>
      </div>

      <Button
        variant="contained"
        className="formButton"
        disabled={!canDeleteAccount}
        onClick={() => handleDeleteAccount()}
        color="error"
      >
        {isUploadingData ? (
          <div className={'spinner'}></div>
        ) : (
          tCommon('delete')
        )}
      </Button>
    </StyledForm>
  ) : (
    <CustomModal
      isOpen={isModalOpen}
      handleContinue={handleSubscriptions}
      handleCancel={closeModal}
      continueButtonText={tCommon('showSubscriptions')}
      cancelButtonText={tCommon('cancel')}
      modalTitle={tCommon('modalTitle')}
      modalSubtitle={tCommon('modalSubtitle')}
    />
  );
}
