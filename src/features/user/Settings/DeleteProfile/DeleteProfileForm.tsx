import React from 'react';
import styles from './DeleteProfile.module.scss';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { deleteAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import CustomModal from '../../../common/Layout/CustomModal';
import router from 'next/router';
import { useTranslation } from 'next-i18next';
import { TextField } from '@mui/material';
import StyledForm from '../../../common/Layout/StyledForm';

export default function DeleteProfileForm() {
  const { user, token, logoutUser, impersonatedEmail } =
    React.useContext(UserPropsContext);
  const { t } = useTranslation(['me', 'common', 'editProfile']);
  const handleChange = (e: React.ChangeEvent<{}>) => {
    e.preventDefault();
  };
  const { handleError } = React.useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [isModalOpen, setisModalOpen] = React.useState(false); //true when subscriptions are present
  const [canDeleteAccount, setcanDeleteAccount] = React.useState(false);

  const handleDeleteAccount = () => {
    setIsUploadingData(true);
    deleteAuthenticatedRequest(
      '/app/profile',
      token,
      impersonatedEmail,
      handleError
    ).then((res) => {
      if (res.error_code === 'active_subscriptions') {
        setIsUploadingData(false);
        setisModalOpen(true);
      } else if (res == 404) {
        console.log(res.errorText);
      } else {
        logoutUser(`${process.env.NEXTAUTH_URL}/`);
      }
    });
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
        <div className={styles.deleteModal}>
          <p className={styles.deleteModalContent}>
            {t('common:deleteAccountMessage', {
              delete: 'Delete',
            })}
            <br />
            <br />
            {t('common:alternativelyEditProfile')}
          </p>
          <TextField
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
          ></TextField>
          <p className={styles.deleteConsent}>
            {t('common:deleteAccountConsent')}
          </p>
          <br />
          <br />
          <b>{t('common:deleteCondition')}</b>
          <p className={styles.deleteModalWarning}>
            {t('common:deleteIrreversible', {
              email: user.email,
            })}
          </p>

          <div className={styles.deleteButtonContainer}>
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
                  <div className={'spinner'}></div>
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
      </div>
    </StyledForm>
  ) : (
    <CustomModal
      isOpen={isModalOpen}
      handleContinue={handleSubscriptions}
      handleCancel={closeModal}
      buttonTitle={t('common:showSubscriptions')}
      modalTitle={t('common:modalTitle')}
      modalSubtitle={t('common:modalSubtitle')}
    />
  );
}
