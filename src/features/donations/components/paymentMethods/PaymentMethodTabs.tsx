import React from 'react';
import CreditCard from '../../../../../public/assets/images/icons/donation/CreditCard';
import GiroPayIcon from '../../../../../public/assets/images/icons/donation/GiroPay';
import PaypalIcon from '../../../../../public/assets/images/icons/donation/PaypalIcon';
import SepaIcon from '../../../../../public/assets/images/icons/donation/SepaIcon';
import SofortIcon from '../../../../../public/assets/images/icons/donation/SofortIcon';
import styles from './../../styles/Donations.module.scss';

function a11yProps(index: any) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `payment-methods-tabpanel-${index}`,
    };
}

export default function PaymentMethodTabs({ paymentType, setPaymentType, showPaypal, showGiroPay, showSepa, showSofort, showCC }: any) {

    const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
        setPaymentType(newValue);
    };

    return (
        <div className={styles.paymentMethodsTabsContainer}>

            {showCC && (
                <button className={`${styles.paymentMethod} ${paymentType === 'CARD' ? styles.paymentMethodSelected : ''}`} onClick={(e) => handleChange(e, 'CARD')}  {...a11yProps('CARD')}>
                    <CreditCard />
                    <label>Credit Card</label>
                </button>
            )}

            {showSofort && (
                <button className={`${styles.paymentMethod} ${paymentType === 'Sofort' ? styles.paymentMethodSelected : ''}`} onClick={(e) => handleChange(e, 'Sofort')}  {...a11yProps('Sofort')}>
                    <SofortIcon />
                    <label>Sofort</label>
                </button>
            )}

            {showPaypal ? (
                <button className={`${styles.paymentMethod} ${paymentType === 'Paypal' ? styles.paymentMethodSelected : ''}`} onClick={(e) => handleChange(e, 'Paypal')}  {...a11yProps('Paypal')}>
                    <PaypalIcon />
                    <label>Paypal</label>
                </button>
            ) : null}

            {showGiroPay && (
                <button className={`${styles.paymentMethod} ${paymentType === 'GiroPay' ? styles.paymentMethodSelected : ''}`} onClick={(e) => handleChange(e, 'GiroPay')}  {...a11yProps('GiroPay')}>
                    <GiroPayIcon />
                    <label>GiroPay</label>
                </button>
            )}

            {showSepa && (
                <button className={`${styles.paymentMethod} ${paymentType === 'SEPA' ? styles.paymentMethodSelected : ''}`} onClick={(e) => handleChange(e, 'SEPA')}  {...a11yProps('SEPA')}>
                    <SepaIcon />
                    <label>SEPA</label>
                </button>
            )}

        </div>
    );
}
