import React, { ReactElement } from 'react'
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import styles from '../../styles/Donations.module.scss';
import i18next from '../../../../../i18n';
import SofortIcon from '../../../../../public/assets/images/icons/donation/SofortIcon';
import InfoIcon from '../../../../../public/assets/images/icons/InfoIcon';

const { useTranslation } = i18next;

interface Props {
    onSubmitPayment:Function;
}

function SofortPayments({ onSubmitPayment }: Props): ReactElement {
    const { t, i18n, ready } = useTranslation(['donate']);

    return (
        <div className={styles.paymentModeContainer}>
            {/* <div className={styles.paymentModeHeader}>
                <SofortIcon />
                <div className={styles.paymentModeTitle}>Sofort</div>
            </div> */}

            <div className={styles.disclaimerContainer}>
                <div>
                    <InfoIcon/>
                </div>
                <p>{t('donate:sofortDisclaimer')}</p>
            </div>


                <div onClick={()=>onSubmitPayment('stripe_sofort','sofort')} className={styles.actionButtonsContainerCenter}>
                    <AnimatedButton className={styles.continueButton}>
                        {t('donate:payWithSofort')}
                    </AnimatedButton>
                </div>

        </div>
    )
}

export default SofortPayments
