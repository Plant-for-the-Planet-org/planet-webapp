import React from 'react';
import styles from './DeleteProfile.module.scss';
import i18next from '../../../../i18n';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../common/InputTypes/AnimatedButton';
import { deleteAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { ThemeContext } from '../../../theme/themeContext';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';

const { useTranslation } = i18next;

export default function DeleteProfile({}: any) {
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
        logoutUser(`${process.env.NEXTAUTH_URL}/`);
      } else {
        console.log(res.errorText);
      }
    });
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
  );
}
