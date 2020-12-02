import React, { ReactElement } from 'react'
import styles from './VerifyEmail.module.scss';
import i18next from './../../../../i18n'
import VerifyEmailIcon from '../../../../public/assets/images/icons/VerifyEmail';
import { useAuth0 } from '@auth0/auth0-react';

const { useTranslation } = i18next;

interface Props {

}

function VerifyEmailComponent({ }: Props): ReactElement {
    const { t } = useTranslation(['common']);

    const {
        loginWithRedirect,
      } = useAuth0();

    return (
        <div className={styles.verifyEmailSection}>
            <VerifyEmailIcon />
            <h2 className={styles.verifyEmailText}>
                {t('common:verifyEmailHeader')}
            </h2>
            {t('common:verifyEmailText')}

            <span style={{ fontStyle: 'italic', marginTop: '12px' }}>
                {t('common:verifyEmailInfo')}
            </span>
            <div onClick={()=>loginWithRedirect()} className={styles.continueButton}>
                {t('common:continueToLogin')}
            </div>
        </div>
    )
}

export default VerifyEmailComponent
