import React, { ReactElement } from 'react';
import BackArrow from '../../../../public/assets/images/icons/headerIcons/BackArrow';
import PaymentProgress from '../../common/ContentLoaders/Donations/PaymentProgress';
import { PaymentDetailsProps } from '../../common/types/donations';
import styles from './../styles/Donations.module.scss';
import {
  createDonationFunction,
  payDonationFunction,
} from '../components/PaymentFunctions';
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
import GiroPayPayments from '../components/paymentMethods/GiroPayPayments';
import SofortPayments from '../components/paymentMethods/SofortPayment';
import tenantConfig from '../../../../tenant.config';
import ToggleSwitch from '../../common/InputTypes/ToggleSwitch';
import { getCountryDataBy } from '../../../utils/countryCurrency/countryUtils';

const config = tenantConfig();

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
  donationID,
  setDonationID,
  shouldCreateDonation,
  setShouldCreateDonation,
}: PaymentDetailsProps): ReactElement {
  const { t, i18n, ready } = useTranslation(['donate', 'common']);

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);

  const [publishName, setpublishName] = React.useState(false);
  const [askpublishName, setaskpublishName] = React.useState(false);

  React.useEffect(() => {
    setPaymentType('CARD');
  }, []);

  React.useEffect(() => {
    // We use the user's details to know whether the we should ask to publish name or not
    // For logged in user's this data will be stored in contact details
    // For logged out user's this will be always false
    if (contactDetails && contactDetails.isPrivate) {
      setaskpublishName(true);
    }
  }, [contactDetails]);

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

  async function getDonation() {
    const donation = await createDonationFunction({
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
    });
    console.log('donation', donation);
    if (donation.isPrivate) {
      setaskpublishName(true);
    }

    setShouldCreateDonation(false);
  }
  React.useEffect(() => {
    if (shouldCreateDonation) {
      getDonation();
    }
  }, [shouldCreateDonation]);

  const onSubmitPayment = (gateway: any, paymentMethod: any) => {
    payDonationFunction({
      gateway,
      paymentMethod,
      setIsPaymentProcessing,
      setPaymentError,
      t,
      paymentSetup,
      donationID,
      token,
      setDonationStep,
      donorDetails,
    });
  };

  const sofortCountries = ['AT', 'BE', 'DE', 'IT', 'NL', 'ES'];

  return ready ? (
    isPaymentProcessing ? (
      <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
    ) : (
      <div className={styles.cardContainer}>
        <div className={styles.header}>
          <button
            id={'backArrowPayment'}
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

{/* {contactDetails && (
          <div className={styles.showContactDetails}>
            <p className={styles.showContactDetailsName}>
              {`${contactDetails.firstName} ${contactDetails.lastName}`}
            </p>
            <p className={styles.showContactDetailsAddress}>
              {`${contactDetails.address}, ${contactDetails.city}`}
            </p>
            <p className={styles.showContactDetailsAddress}>
              {`${contactDetails.zipCode}, ${getCountryDataBy('countryCode',contactDetails.country).countryName}`}
            </p>
            <p className={styles.showContactDetailsAddress}>
              {`${contactDetails.email}`}
            </p>
          </div>
        )} */}

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
        <div className={styles.plantProjectName} style={{textAlign:'center',marginTop:'10px'}}>
            {t('common:to_project_by_tpo', {
              projectName: project.name,
              tpoName: project.tpo.name,
            })}
          </div>


          {
          askpublishName ? (
            <div className={styles.isCompany}>
              <label htmlFor="publishName" className={styles.isCompanyText}>
                {t('donate:askPublishName')}
              </label>
              <ToggleSwitch
                id="publishName"
                checked={publishName}
                onChange={() => setpublishName(!publishName)}
                name="checkedB"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
          ) : (
            <div className={styles.isCompany}>
              <label className={styles.isCompanyText}>
                {t('donate:nameAlreadyPublished')}
              </label>
            </div>
          )}

        <PaymentMethodTabs
          paymentType={paymentType}
          setPaymentType={setPaymentType}
          showCC={paymentSetup?.gateways.stripe.methods.includes('stripe_cc')}
          showGiroPay={
            country === 'DE' &&
            paymentSetup?.gateways.stripe.methods.includes('stripe_giropay')
          }
          showSepa={
            currency === 'EUR' &&
            (config.enableGuestSepa || token) &&
            paymentSetup?.gateways.stripe.methods.includes('stripe_sepa')
          }
          showSofort={
            sofortCountries.includes(country) &&
            paymentSetup?.gateways.stripe.methods.includes('stripe_sofort')
          }
          showPaypal={
            paypalCurrencies.includes(currency) && paymentSetup?.gateways.paypal
          }
        />


        {donationID && (
          <>
            <div
              role="tabpanel"
              hidden={paymentType !== 'CARD'}
              id={`payment-methods-tabpanel-${'CARD'}`}
              aria-labelledby={`scrollable-force-tab-${'CARD'}`}
            >
              <Elements stripe={getStripe(paymentSetup)}>
                <CardPayments
                  donorDetails={donorDetails}
                  onPaymentFunction={(data) => onSubmitPayment('stripe', data)}
                  paymentType={paymentType}
                  setPaymentType={setPaymentType}
                />
              </Elements>
            </div>

            {/* SEPA */}
            <div
              role="tabpanel"
              hidden={paymentType !== 'SEPA'}
              id={`payment-methods-tabpanel-${'SEPA'}`}
              aria-labelledby={`scrollable-force-tab-${'SEPA'}`}
            >
              <Elements stripe={getStripe(paymentSetup)}>
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
              <Elements stripe={getStripe(paymentSetup)}>
                <GiroPayPayments onSubmitPayment={onSubmitPayment} />
              </Elements>
            </div>

            <div
              role="tabpanel"
              hidden={paymentType !== 'Sofort'}
              id={`payment-methods-tabpanel-${'Sofort'}`}
              aria-labelledby={`scrollable-force-tab-${'Sofort'}`}
            >
              <Elements stripe={getStripe(paymentSetup)}>
                <SofortPayments onSubmitPayment={onSubmitPayment} />
              </Elements>
            </div>
          </>
        )}

       
      </div>
    )
  ) : (
    <></>
  );
}

export default PaymentDetails;
