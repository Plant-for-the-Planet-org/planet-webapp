import React from 'react';
import styles from './DeleteProfile.module.scss';
import i18next from '../../../../i18n';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../common/InputTypes/AnimatedButton';
import { deleteAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { ThemeContext } from '../../../theme/themeContext';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';

const { useTranslation } = i18next;

export default function DeleteProfile({}: any) {
  const { user, token, logoutUser } = React.useContext(UserPropsContext);
  const { t, ready } = useTranslation(['me', 'common', 'editProfile']);
  const handleChange = (e) => {
    e.preventDefault();
  };
  const { handleError } = React.useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [isSubscription, setIsSubscription] = React.useState(false);

  const [canDeleteAccount, setcanDeleteAccount] = React.useState(false);

  const handleDeleteAccount = () => {
    setIsUploadingData(true);
    deleteAuthenticatedRequest('/app/profile', token, handleError).then(
      (res) => {
        if (res == 400) {
          setIsSubscription(true);
        } else if (res == 404) {
          console.log(res.errorText);
        } else {
          logoutUser(`${process.env.NEXTAUTH_URL}/`);
        }
      }
    );
  };

  const { theme } = React.useContext(ThemeContext);

  return (
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

        <h5>
          {' '}
          Before proceeding, make sure you've deleted all subscriptions before .
        </h5>
        <p className={styles.deleteModalWarning}>
          {t('common:deleteIrreversible', {
            email: user.email,
          })}
        </p>

        {isSubscription && <h5>Please cancel your Subscription first</h5>}

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
              {isUploadingData && !isSubscription ? (
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
  );
}
