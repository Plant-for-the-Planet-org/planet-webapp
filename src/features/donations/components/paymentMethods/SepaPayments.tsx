import { FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
    IbanElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import React, { ReactElement } from 'react';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import styles from './../../styles/PaymentDetails.module.scss';
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
            let payload = await createPaymentMethodSepa(sepaElement, contactDetails);
            paymentMethod = payload.paymentMethod;
            // Add payload error if failed
        }
        if (paymentMethod) {
            onPaymentFunction(paymentMethod);
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
                <div className={styles.paymentModeHeader}>
                    <SepaIcon />
                    <div className={styles.paymentModeTitle}>SEPA Direct Debit</div>
                    {/* <div className={styles.paymentModeFee}>
                        <div className={styles.paymentModeFeeAmount}>€ 0,35 fee</div>
                        <InfoIcon />
                    </div> */}
                </div>

                <div>
                    <div className={styles.mandateAcceptance}>
                        By providing your IBAN and confirming this payment, you authorise
                        (A) Rocketship Inc and Stripe, our payment service provider, to send
                        instructions to your bank to debit your account and (B) your bank to
                        debit your account in accordance with those instructions. You are
                        entitled to a refund from your bank under the terms and conditions of
                        your agreement with your bank. A refund must be claimed within 8 weeks
                        starting from the date on which your account was debited.
                    </div>
                    <FormControlNew variant="outlined">
                        <IbanElement
                            id="iban"
                            options={SEPA_OPTIONS}
                        />
                    </FormControlNew>
                </div>
            </div>


            {showContinue ? (
                <div onClick={handleSubmit} className={styles.actionButtonsContainer}>
                    <AnimatedButton className={styles.continueButton}>
                        {t('common:donate')}
                    </AnimatedButton>
                </div>
            ) : (
                    <div className={styles.actionButtonsContainer}>
                        <AnimatedButton disabled className={styles.continueButtonDisabled}>
                            {t('common:donate')}
                        </AnimatedButton>
                    </div>
                )}

        </div>
    ) : <></>;
}

export default SepaPayments;
