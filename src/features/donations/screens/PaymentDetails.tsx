import React, { ReactElement } from 'react';
import BackArrow from '../../../../public/assets/images/icons/headerIcons/BackArrow';
import PaymentProgress from '../../common/ContentLoaders/Donations/PaymentProgress';
import { PaymentDetailsProps } from '../../common/types/donations';
import styles from './../styles/PaymentDetails.module.scss';
import { createDonationFunction, payDonationFunction } from '../components/PaymentFunctions';
import i18next from '../../../../i18n';
import { paypalCurrencies } from '../../../utils/paypalCurrencies';
import CardPayments from '../components/paymentMethods/CardPayments';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '../../../utils/stripe/getStripe';
import ShowTreeCount from '../components/ShowTreeCount';
import PaymentMethodTabs from '../components/paymentMethods/PaymentMethodTabs';
import SepaPayments from '../components/paymentMethods/SepaPayments';
import PaypalPayments from '../components/paymentMethods/PaypalPayments';
import GiroPayPayments from '../components/paymentMethods/GiroPayPayments';
import SofortPayments from '../components/paymentMethods/SofortPayment';

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
  token,
  recurrencyMnemonic,
  donationID,
  setDonationID,
  shouldCreateDonation,
  setShouldCreateDonation
}: PaymentDetailsProps): ReactElement {
  const { t, i18n, ready } = useTranslation(['donate', 'common']);

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);

  React.useEffect(() => {
    setPaymentType('CARD');
  }, []);

  const [paymentError, setPaymentError] = React.useState('');

  const donorDetails = {
    firstname: contactDetails.firstName,
    lastname: contactDetails.lastName,
    email: contactDetails.email,
    address: contactDetails.address,
    zipCode: contactDetails.zipCode,
    city: contactDetails.city,
    country: contactDetails.country,
    companyname: contactDetails.companyName,
  };


  React.useEffect(() => {
    if (shouldCreateDonation) {
      createDonationFunction({
        isTaxDeductible,
        country,
        project,
        treeCost,
        treeCount,
        currency,
        donorDetails,
        isGift,
        giftDetails,
        setIsPaymentProcessing,
        setPaymentError,
        setDonationID,
        token,
        recurrencyMnemonic
      });
      setShouldCreateDonation(false)
    }
  }, [shouldCreateDonation])


  const onSubmitPayment = (gateway: any, paymentMethod: any) => {
    payDonationFunction({
      gateway,
      paymentMethod,
      setIsPaymentProcessing,
      setPaymentError,
      t,
      paymentSetup,
      recurrencyMnemonic,
      donationID,
      token,
      donorDetails
    })
  }

  const sofortCountries = ['AT', 'BE', 'DE', 'IT', 'NL', 'ES']

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

          <ShowTreeCount treeCost={treeCost} treeCount={treeCount} currency={currency} recurrencyMnemonic={recurrencyMnemonic} />

          <PaymentMethodTabs
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            showCC={paymentSetup?.gateways.stripe.methods.includes("stripe_cc")}
            showGiroPay={country === 'DE' && paymentSetup?.gateways.stripe.methods.includes("stripe_giropay")}
            showSepa={paymentSetup?.gateways.stripe.methods.includes("stripe_sepa")}
            showSofort={sofortCountries.includes(country) && paymentSetup?.gateways.stripe.methods.includes("stripe_sofort")}
            showPaypal={paypalCurrencies.includes(currency) && paymentSetup?.gateways.paypal && recurrencyMnemonic === 'none'}
          />

          {donationID && (
            <>
              <div
                role="tabpanel"
                hidden={paymentType !== 'CARD'}
                id={`payment-methods-tabpanel-${'CARD'}`}
                aria-labelledby={`scrollable-force-tab-${'CARD'}`}
              >
                <Elements
                  stripe={getStripe(paymentSetup)}>
                  <CardPayments donorDetails={donorDetails} onPaymentFunction={(data) => onSubmitPayment('stripe', data)} paymentType={paymentType} setPaymentType={setPaymentType} />
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
                    onPaymentFunction={onSubmitPayment}
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
                {paymentType === 'Paypal' && (
                  <PaypalPayments
                    paymentSetup={paymentSetup}
                    treeCount={treeCount}
                    treeCost={treeCost}
                    currency={currency}
                    donationID={donationID}
                    payDonationFunction={onSubmitPayment}
                  />
                )}

              </div>
              <div
                role="tabpanel"
                hidden={paymentType !== 'GiroPay'}
                id={`payment-methods-tabpanel-${'GiroPay'}`}
                aria-labelledby={`scrollable-force-tab-${'GiroPay'}`}
              >
                <Elements
                  stripe={getStripe(paymentSetup)}>
                  <GiroPayPayments
                    onSubmitPayment={onSubmitPayment}
                  />
                </Elements>
              </div>

              <div
                role="tabpanel"
                hidden={paymentType !== 'Sofort'}
                id={`payment-methods-tabpanel-${'Sofort'}`}
                aria-labelledby={`scrollable-force-tab-${'Sofort'}`}
              >
                <Elements
                  stripe={getStripe(paymentSetup)}>
                  <SofortPayments
                    onSubmitPayment={onSubmitPayment}
                  />
                </Elements>
              </div>
            </>
          )}


        </div>
      )
  ) : <></>;
}

export default PaymentDetails;
