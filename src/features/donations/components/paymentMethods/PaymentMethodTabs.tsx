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

export default function PaymentMethodTabs({
  paymentType,
  setPaymentType,
  showPaypal,
  showGiroPay,
  showSepa,
  showSofort,
  showCC,
}: any) {
  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setPaymentType(newValue);
  };

  function CheckMark() {
    return (
      <div className={styles.checkMark}>
        <svg
          height="20px"
          width="20px"
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(-39 -408)" data-name="Group 3308">
            <path
              transform="translate(39 408)"
              d="M15,0A15,15,0,1,1,0,15,15,15,0,0,1,15,0Z"
              fill="#48aadd"
              data-name="Path 2171"
            />
            <path
              transform="translate(44.957 351.72)"
              d="M6.143,77.228.265,71.836a.782.782,0,0,1,0-1.173l1.279-1.173a.963.963,0,0,1,1.279,0l3.96,3.633,8.481-7.781a.963.963,0,0,1,1.279,0l1.279,1.173a.782.782,0,0,1,0,1.173l-10.4,9.541a.963.963,0,0,1-1.279,0Z"
              fill="#fff"
            />
          </g>
        </svg>
      </div>
    );
  }
  return (
    <div className={styles.paymentMethodsTabsContainer}>
      {showCC && (
        <button
          className={`${styles.paymentMethod} ${
            paymentType === 'CARD' ? styles.paymentMethodSelected : ''
          }`}
          onClick={(e) => handleChange(e, 'CARD')}
          {...a11yProps('CARD')}
        >
          <CreditCard />
          <label>Credit Card</label>
          <CheckMark />
        </button>
      )}

      {showSofort && (
        <button
          className={`${styles.paymentMethod} ${
            paymentType === 'Sofort' ? styles.paymentMethodSelected : ''
          }`}
          onClick={(e) => handleChange(e, 'Sofort')}
          {...a11yProps('Sofort')}
        >
          <SofortIcon />
          <label>Sofort</label>
          <CheckMark />
        </button>
      )}

      {showPaypal ? (
        <button
          className={`${styles.paymentMethod} ${
            paymentType === 'Paypal' ? styles.paymentMethodSelected : ''
          }`}
          onClick={(e) => handleChange(e, 'Paypal')}
          {...a11yProps('Paypal')}
        >
          <PaypalIcon />
          <label>Paypal</label>
          <CheckMark />
        </button>
      ) : null}

      {showGiroPay && (
        <button
          className={`${styles.paymentMethod} ${
            paymentType === 'GiroPay' ? styles.paymentMethodSelected : ''
          }`}
          onClick={(e) => handleChange(e, 'GiroPay')}
          {...a11yProps('GiroPay')}
        >
          <GiroPayIcon />
          <label>GiroPay</label>
          <CheckMark />
        </button>
      )}

      {showSepa && (
        <button
          className={`${styles.paymentMethod} ${
            paymentType === 'SEPA' ? styles.paymentMethodSelected : ''
          }`}
          onClick={(e) => handleChange(e, 'SEPA')}
          {...a11yProps('SEPA')}
        >
          <SepaIcon />
          <label>SEPA</label>
          <CheckMark />
        </button>
      )}
    </div>
  );
}
