import React, { ReactElement } from 'react';
import styles from './../../styles/PaymentDetails.module.scss';
import { createDonation, payDonation, createDonationData } from '../../components/PaymentFunctions';
import i18next from '../../../../../i18n';
import PaypalIcon from '../../../../../public/assets/images/icons/donation/PaypalIcon';
import Paypal from './Paypal';
import { paypalCurrencies } from '../../../../utils/paypalCurrencies';
const { useTranslation } = i18next;

function PaypalPayments({
    paymentSetup,
    project,
    treeCount,
    treeCost,
    currency,
    setDonationStep,
    isGift,
    giftDetails,
    country,
    isTaxDeductible,
    token,
    setPaymentError,
    setIsPaymentProcessing,
    donorDetails
}: any): ReactElement {
    const { t, i18n, ready } = useTranslation(['donate', 'common']);

    const [paypalProcessing, setPaypalProcessing] = React.useState(false);
    const [donationID, setDonationID] = React.useState(false);

    // Function to process paypal donations, this will create a donation ID
    const createDonationWithPaypal = () => {
        setPaypalProcessing(true)

        let taxDeductionCountry = isTaxDeductible ? country : null;

        let donationeData = createDonationData({ project, treeCount, treeCost, currency, donorDetails, taxDeductionCountry, isGift, giftDetails })

        createDonation(donationeData, token)
            .then((res) => {
                if (res.code === 400 || res.code === 401) {
                    setIsPaymentProcessing(false);
                    setPaymentError(res.message);
                    setPaypalProcessing(false)
                } else if (res.code === 500) {
                    setIsPaymentProcessing(false);
                    setPaypalProcessing(false);
                    setPaymentError(t('donate:somethingWentWrong'));
                } else if (res.code === 503) {
                    setIsPaymentProcessing(false);
                    setPaypalProcessing(false);
                    setPaymentError(
                        t('donate:underMaintenance'),
                    );
                } else {
                    setDonationID(res.id);
                    setPaypalProcessing(false)
                }
            });
    }

    // Function to process paypal donations, this will pay for paypal
    const paypalSuccess = (data: any) => {
        if (data.error) {
            setPaymentError(data.error.message)
        } else {
            setIsPaymentProcessing(true);
            let payDonationData;
            payDonationData = {
                paymentProviderRequest: {
                    account: paymentSetup.gateways.paypal.account,
                    gateway: 'paypal',
                    source: {
                        ...data
                    },
                },
            };
            payDonation(payDonationData, donationID, token)
                .then(async (res) => {
                    if (res.code === 400) {
                        setIsPaymentProcessing(false);
                        setPaymentError(res.message);
                        return;
                    } if (res.code === 500) {
                        setIsPaymentProcessing(false);
                        setPaymentError(t('donate:somethingWentWrong'));
                        return;
                    } if (res.code === 503) {
                        setIsPaymentProcessing(false);
                        setPaymentError(
                            t('donate:underMaintenance'),
                        );
                        return;
                    }
                    if (res.status === 'failed') {
                        setIsPaymentProcessing(false);
                        setPaymentError(res.message);
                    } else if (res.paymentStatus === 'success') {
                        setIsPaymentProcessing(false);
                        setDonationStep(4)
                    }
                })
                .catch((error) => {
                    setIsPaymentProcessing(false);
                    setPaymentError(error.message);
                });
        }
    }

    return (
        <div>
            {paypalCurrencies.includes(currency) && paymentSetup?.gateways.paypal &&
                <div className={styles.paymentModeContainer} onClick={() => createDonationWithPaypal()}>
                    <div className={styles.paymentModeHeader}>
                        <PaypalIcon />
                        <div className={styles.paymentModeTitle}>Paypal</div>
                        {paypalProcessing && <div className={styles.spinner} />}
                    </div>
                    {(
                        donationID && (
                            <Paypal
                                onSuccess={data => {
                                    paypalSuccess(data);
                                }}
                                amount={treeCost * treeCount}
                                currency={currency}
                                donationId={donationID}
                                mode={paymentSetup?.gateways.paypal.isLive ? 'production' : 'sandbox'}
                                clientID={paymentSetup?.gateways.paypal.authorization.client_id}
                            />
                        )
                    )}

                </div>
            }
        </div>
    );
}

export default PaypalPayments;
