import React, { ReactElement } from 'react'
import styles from './VerifyEmail.module.scss';
import i18next from './../../../../i18n'
import VerifyEmailIcon from '../../../../public/assets/images/icons/VerifyEmail';
import { useAuth0 } from '@auth0/auth0-react';

const { useTranslation } = i18next;

interface Props {

}

function VerifyEmailComponent({ }: Props): ReactElement {
    const { t, ready } = useTranslation(['common']);

    const {
        loginWithRedirect,
      } = useAuth0();

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
            <div onClick={() => loginWithRedirect({redirectUri: `${process.env.NEXTAUTH_URL}/login`, ui_locales: localStorage.getItem('language') || 'en' })} className={styles.continueButton}>
                {t('common:continueToLogin')}
            </div>
        </div>
    ) : null;
}

export default VerifyEmailComponent
