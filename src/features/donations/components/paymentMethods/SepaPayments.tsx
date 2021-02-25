import { FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
    IbanElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import React, { ReactElement } from 'react';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import styles from './../../styles/Donations.module.scss';
import i18next from '../../../../../i18n';
import SepaIcon from '../../../../../public/assets/images/icons/donation/SepaIcon';

const { useTranslation } = i18next;

const SEPA_OPTIONS = {
    supportedCountries: ['SEPA'],
    style: {
        base: {
            fontSize: '14px',
            color: '#424770',
            letterSpacing: '0.025em',
            fontFamily: styles.primaryFontFamily,
            '::placeholder': {
                color: '#aab7c4',
                fontFamily: styles.primaryFontFamily,
            },
        },
        invalid: {
            color: '#9e2146',
        },
    },
};

const FormControlNew = withStyles({
    root: {
        width: '100%',
        backgroundColor: '#F2F2F7',
        border: '0px!important',
        borderRadius: '10px',
        fontFamily: styles.primaryFontFamily,
        padding: '18.5px',
    },
})(FormControl);


function SepaPayments({
    paymentType,
    onPaymentFunction,
    contactDetails
}: any): ReactElement {
    const { t, i18n, ready } = useTranslation(['donate', 'common']);
    const stripe = useStripe();
    const elements = useElements();


    const [paymentError, setPaymentError] = React.useState('');
    const [showContinue, setShowContinue] = React.useState(false);

    const validateChange = () => {
        const sepaElement = elements.getElement(IbanElement)!;
        sepaElement.on('change', ({ error }) => {
            if (error) {
                setShowContinue(false)
            } else {
                setShowContinue(true)
            }
        });
    }

    const createPaymentMethodSepa = (sepaElement: any, contactDetails: any) => {
        return stripe?.createPaymentMethod({
            type: 'sepa_debit',
            sepa_debit: sepaElement,
            billing_details: {
                name: contactDetails.firstName,
                email: contactDetails.email,
            },
        })
    }
    const handleSubmit = async (event: { preventDefault: () => void }) => {
        setShowContinue(false);
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        let paymentMethod: any;

        if (paymentType === 'SEPA') {
            const sepaElement = elements.getElement(IbanElement)!;
            const payload = await createPaymentMethodSepa(sepaElement, contactDetails);
            paymentMethod = payload.paymentMethod;
            // Add payload error if failed
        }
        if (paymentMethod) {
            onPaymentFunction('stripe', paymentMethod);
        } else {
            setPaymentError(t('donate:noPaymentMethodError'));
            return;
        }
    };

    return ready ? (
        <div>

            {paymentError && (
                <div className={styles.paymentError}>{paymentError}</div>
            )}

            <div className={styles.paymentModeContainer}>

                <div>
                    <div className={styles.mandateAcceptance}>
                        {t('donate:sepaMessage')}
                    </div>
                    <FormControlNew variant="outlined">
                        <IbanElement
                            id="iban"
                            options={SEPA_OPTIONS}
                            onChange={validateChange}
                        />
                    </FormControlNew>
                </div>
            </div>


            {showContinue ? (
                <div onClick={handleSubmit} className={styles.actionButtonsContainerCenter}>
                    <AnimatedButton className={styles.continueButton} id='donateContinueButton'>
                        {t('common:donate')}
                    </AnimatedButton>
                </div>
            ) : (
                    <div className={styles.actionButtonsContainerCenter}>
                        <AnimatedButton disabled className={styles.continueButtonDisabled} id='donateContinueButton'>
                            {t('common:donate')}
                        </AnimatedButton>
                    </div>
                )}

        </div>
    ) : <></>;
}

export default SepaPayments;
