import React, { ReactElement } from 'react';
import styles from './VerifyEmail.module.scss';
import i18next from './../../../../i18n';
import VerifyEmailIcon from '../../../../public/assets/images/icons/VerifyEmail';
import { UserPropsContext } from '../Layout/UserPropsContext';

const { useTranslation } = i18next;

interface Props {}

function VerifyEmailComponent({}: Props): ReactElement {
  const { t, ready } = useTranslation(['common']);

  const { loginWithRedirect } = React.useContext(UserPropsContext);

  return ready ? (
    <div className={styles.verifyEmailSection}>
      <VerifyEmailIcon />
      <h2 className={styles.verifyEmailText}>
        {t('common:verifyEmailHeader')}
      </h2>
      {t('common:verifyEmailText')}

      <span style={{ fontStyle: 'italic', marginTop: '12px' }}>
        {t('common:verifyEmailInfo')}
      </span>
      <button
        id={'verifyEmail'}
        onClick={() =>
          loginWithRedirect({
            redirectUri: `${process.env.NEXTAUTH_URL}/login`,
            ui_locales: localStorage.getItem('language') || 'en',
          })
        }
        className={'primaryButton'}
      >
        {t('common:continueToLogin')}
      </button>
    </div>
  ) : (
    <></>
  );
}

export default VerifyEmailComponent;
