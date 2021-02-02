import React, { ReactElement } from 'react';
import BackArrow from '../../../../public/assets/images/icons/headerIcons/BackArrow';
import PaymentProgress from '../../common/ContentLoaders/Donations/PaymentProgress';
import { PaymentDetailsProps } from '../../common/types/donations';
import styles from './../styles/PaymentDetails.module.scss';
import { payWithCard } from '../components/PaymentFunctions';
import i18next from '../../../../i18n';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import { getFormattedNumber } from '../../../utils/getFormattedNumber';
import { paypalCurrencies } from '../../../utils/paypalCurrencies';
import CardPayments from '../components/paymentMethods/CardPayments';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '../../../utils/stripe/getStripe';
import PaymentMethodTabs from '../components/paymentMethods/PaymentMethodTabs';
import SepaPayments from '../components/paymentMethods/SepaPayments';
import PaypalPayments from '../components/paymentMethods/PaypalPayments';

const { useTranslation } = i18next;

function PaymentDetails({
  paymentSetup,
  project,
  treeCount,
  treeCost,
  currency,
  setDonationStep,
  contactDetails,
  isGift,
  giftDetails,
  paymentType,
  setPaymentType,
  country,
  isTaxDeductible,
  token
}: PaymentDetailsProps): ReactElement {
  const { t, i18n, ready } = useTranslation(['donate', 'common']);

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);

  React.useEffect(() => {
    setPaymentType('CARD');
  }, []);

  const [paymentError, setPaymentError] = React.useState('');

  let donorDetails = {
    firstname: contactDetails.firstName,
    lastname: contactDetails.lastName,
    email: contactDetails.email,
    address: contactDetails.address,
    zipCode: contactDetails.zipCode,
    city: contactDetails.city,
    country: contactDetails.country,
    companyname: contactDetails.companyName,
  };


  const onPaymentFunction = (gateway: any, paymentMethod: any) => {
    if (!paymentMethod) {
      setPaymentError(t('donate:noPaymentMethodError'));
      return;
    }
    const payWithCardProps = {
      setDonationStep,
      setIsPaymentProcessing,
      project,
      currency,
      treeCost,
      treeCount,
      giftDetails,
      isGift,
      setPaymentError,
      paymentSetup,
      window,
      paymentMethod,
      donorDetails,
      taxDeductionCountry: isTaxDeductible ? country : null,
      token: token
    };
    payWithCard({ ...payWithCardProps });
  };

  return ready ? (
    isPaymentProcessing ? (
      <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
    ) : (
        <div className={styles.container}>
          <div className={styles.header}>
            <button id={'backArrowPayment'}
              onClick={() => setDonationStep(2)}
              className={styles.headerBackIcon}
            >
              <BackArrow />
            </button>
            <div className={styles.headerTitle}>{t('donate:paymentDetails')}</div>
          </div>

          {paymentError && (
            <div className={styles.paymentError}>{paymentError}</div>
          )}

          <div className={styles.finalTreeCount}>
            <div className={styles.totalCost}>
              {getFormatedCurrency(i18n.language, currency, treeCount * treeCost)}
            </div>
            <div className={styles.totalCostText}>
              {t('donate:fortreeCountTrees', {
                treeCount: getFormattedNumber(i18n.language, Number(treeCount)),
              })}
            </div>
          </div>

          <PaymentMethodTabs paymentType={paymentType} setPaymentType={setPaymentType} showPaypal={paypalCurrencies.includes(currency) && paymentSetup?.gateways.paypal} />
          <div
            role="tabpanel"
            hidden={paymentType !== 'CARD'}
            id={`payment-methods-tabpanel-${'CARD'}`}
            aria-labelledby={`scrollable-force-tab-${'CARD'}`}
          >
            <Elements
              stripe={getStripe(paymentSetup)}>
              <CardPayments onPaymentFunction={(data) => onPaymentFunction('stripe', data)} paymentType={paymentType} setPaymentType={setPaymentType} />
            </Elements>
          </div>

          {/* SEPA */}
          <div
            role="tabpanel"
            hidden={paymentType !== 'SEPA'}
            id={`payment-methods-tabpanel-${'SEPA'}`}
            aria-labelledby={`scrollable-force-tab-${'SEPA'}`}
          >
            <Elements
              stripe={getStripe(paymentSetup)}>
              <SepaPayments
                paymentType={paymentType}
                onPaymentFunction={onPaymentFunction}
                contactDetails={contactDetails}
              />
            </Elements>
          </div>

          {/* Paypal */}
          <div
            role="tabpanel"
            hidden={paymentType !== 'Paypal'}
            id={`payment-methods-tabpanel-${'Paypal'}`}
            aria-labelledby={`scrollable-force-tab-${'Paypal'}`}
          >

            <PaypalPayments paymentSetup={paymentSetup}
              project={project}
              treeCount={treeCount}
              treeCost={treeCost}
              currency={currency}
              setDonationStep={setDonationStep}
              isGift={isGift}
              giftDetails={giftDetails}
              paymentType={paymentType}
              country={country}
              isTaxDeductible={isTaxDeductible}
              token={token}
              setPaymentError={setPaymentError}
              setIsPaymentProcessing={setIsPaymentProcessing}
              donorDetails={donorDetails} />

          </div>
          <div
            role="tabpanel"
            hidden={paymentType !== 'Jiro'}
            id={`payment-methods-tabpanel-${'Jiro'}`}
            aria-labelledby={`scrollable-force-tab-${'Jiro'}`}
          >
            Item Four
            </div>

        </div>
      )
  ) : <></>;
}

export default PaymentDetails;
