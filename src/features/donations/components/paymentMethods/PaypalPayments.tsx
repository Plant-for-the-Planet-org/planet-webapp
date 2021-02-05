import React, { ReactElement } from 'react';
import styles from './../../styles/PaymentDetails.module.scss';
import PaypalIcon from '../../../../../public/assets/images/icons/donation/PaypalIcon';
import Paypal from './Paypal';
import { paypalCurrencies } from '../../../../utils/paypalCurrencies';

function PaypalPayments({
    paymentSetup,
    treeCount,
    treeCost,
    currency,
    donationID,
    payDonationFunction
}: any): ReactElement {

    
    return (
        <div>
            {paypalCurrencies.includes(currency) && paymentSetup?.gateways.paypal &&
                <div className={styles.paymentModeContainer}>
                    <div className={styles.paymentModeHeader}>
                        <PaypalIcon />
                        <div className={styles.paymentModeTitle}>Paypal</div>
                    </div>
                    <Paypal
                        onSuccess={data => {
                            payDonationFunction('paypal',data);
                        }}
                        amount={treeCost * treeCount}
                        currency={currency}
                        donationId={donationID}
                        mode={paymentSetup?.gateways.paypal.isLive ? 'production' : 'sandbox'}
                        clientID={paymentSetup?.gateways.paypal.authorization.client_id}
                    />
                </div>
            }
        </div>
    );
}

export default PaypalPayments;
