import React, { ReactElement } from 'react'
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import styles from '../../styles/PaymentDetails.module.scss';
import i18next from '../../../../../i18n';
import SofortIcon from '../../../../../public/assets/images/icons/donation/SofortIcon';

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

           
                <div onClick={()=>onSubmitPayment('stripe_sofort','sofort')} className={styles.actionButtonsContainer}>
                    <AnimatedButton className={styles.continueButton}>
                        {t('donate:payWithSofort')}
                    </AnimatedButton>
                </div>
        
        </div>
    )
}

export default SofortPayments
