import React, { ReactElement } from 'react'
import styles from './VerifyEmail.module.scss';
import i18next from './../../../../i18n'

const { useTranslation } = i18next;

interface Props {

}

function VerifyEmailComponent({ }: Props): ReactElement {
    const { t } = useTranslation(['common']);
    return (
        <div className={styles.verifyEmailSection}>
            <h2 className={styles.verifyEmailText}>
                {t('common:verifyEmail')}
            </h2>

            <img
                className={styles.verifyEmailBushImage}
                src="/tenants/planet/images/leaderboard/Person.svg"
                alt=""
            />
            <img
                className={styles.verifyEmailGroupTreeImage}
                src="/tenants/planet/images/leaderboard/Trees.svg"
                alt=""
            />
        </div>
    )
}

export default VerifyEmailComponent
