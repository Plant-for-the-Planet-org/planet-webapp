import React from 'react';
import styles from './DeleteProfile.module.scss';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../common/InputTypes/AnimatedButton';
import { deleteAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import CustomModal from '../../common/Layout/CustomModal';
import router from 'next/router';
import { useTranslation } from 'next-i18next';
import { APIError, handleError, SerializedError } from '@planet-sdk/common';

export default function DeleteProfile({}: any) {
  const { user, token, logoutUser } = React.useContext(UserPropsContext);
  const { t } = useTranslation(['me', 'common', 'editProfile']);
  const handleChange = (e) => {
    e.preventDefault();
  };
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [isModalOpen, setisModalOpen] = React.useState(false); //true when subscriptions are present
  const [canDeleteAccount, setcanDeleteAccount] = React.useState(false);

  const handleDeleteAccount = async () => {
    setIsUploadingData(true);
    try {
      await deleteAuthenticatedRequest('/app/profile', token);
      logoutUser(`${process.env.NEXTAUTH_URL}/`);
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
    <div className="profilePage">
      <p className={'profilePageTitle'}> {t('common:deleteAccount')}</p>
      <div className={styles.deleteModal}>
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
