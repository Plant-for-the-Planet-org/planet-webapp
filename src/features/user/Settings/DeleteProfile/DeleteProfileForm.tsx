import React from 'react';
import styles from './DeleteProfile.module.scss';
import { deleteAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import CustomModal from '../../../common/Layout/CustomModal';
import router from 'next/router';
import { useTranslations } from 'next-intl';
import { Button, TextField } from '@mui/material';
import StyledForm from '../../../common/Layout/StyledForm';
import { APIError, handleError, SerializedError } from '@planet-sdk/common';
import { useTenant } from '../../../common/Layout/TenantContext';

export default function DeleteProfileForm() {
  const { user, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const tCommon = useTranslations('Common');
  const handleChange = (e: React.ChangeEvent<{}>) => {
    e.preventDefault();
  };
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [isModalOpen, setisModalOpen] = React.useState(false); //true when subscriptions are present
  const [canDeleteAccount, setcanDeleteAccount] = React.useState(false);

  const handleDeleteAccount = async () => {
    setIsUploadingData(true);
    try {
      await deleteAuthenticatedRequest(
        tenantConfig?.id,
        '/app/profile',
        token,
        logoutUser
      );
      setIsUploadingData(false);
      logoutUser(`${window.location.origin}/`);
    } catch (err) {
      setIsUploadingData(false);
      const serializedErrors = handleError(err as APIError);
      const _serializedErrors: SerializedError[] = [];

      for (const error of serializedErrors) {
        switch (error.message) {
          case 'active_subscriptions':
            setisModalOpen(true);
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
    setisModalOpen(false);
    router.push('/profile/recurrency');
  };

  const closeModal = () => {
    setisModalOpen(false);
    setcanDeleteAccount(false);
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
              setcanDeleteAccount(true);
            } else {
              setcanDeleteAccount(false);
            }
          }}
        ></TextField>
        <p className={styles.deleteConsent}>
          {tCommon('deleteAccountConsent')}
        </p>
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
      buttonTitle={tCommon('showSubscriptions')}
      modalTitle={tCommon('modalTitle')}
      modalSubtitle={tCommon('modalSubtitle')}
    />
  );
}
