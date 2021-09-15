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
import Link from 'next/link';
import { putRequest } from '../../../utils/apiRequests/api';

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
  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);
  const [directGift, setDirectGift] = React.useState(null);

  const [publishName, setpublishName] = React.useState(false);
  const [askpublishName, setaskpublishName] = React.useState(false);

  React.useEffect(() => {
    setPaymentType('CARD');
  }, []);

  React.useEffect(() => {
    if (donationID) {
      putRequest(`/app/donations/${donationID}/publish`, {
        publish: publishName,
      });
    }
  }, [publishName, donationID]);

  React.useEffect(() => {
    const getdirectGift = localStorage.getItem('directGift');
    if (getdirectGift) {
      setDirectGift(JSON.parse(getdirectGift));
    }
  }, []);
  const [paymentError, setPaymentError] = React.useState('');

  const [donationUid, setDonationUid] = React.useState(null);

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
    setDonationUid(donation.uid);
    setaskpublishName(!donation.hasPublicProfile);
    setpublishName(donation.hasPublicProfile);
    setDonationID(donation.id);

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
      country,
    });
  };

  const sofortCountries = ['AT', 'BE', 'DE', 'IT', 'NL', 'ES'];

  return ready ? (
    isPaymentProcessing ? (
      <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
    ) : (
      <div className={styles.cardContainer}>
        <div className={styles.header} style={{ minHeight: '200px' }}>
          <div className={styles.headerTitleContainer}>
            <button
              id={'backArrowPayment'}
              onClick={() => setDonationStep(2)}
              className={styles.headerBackIcon}
            >
              <BackArrow color="#ffffff" />
            </button>
            <div>
              <div className={styles.headerTitle}>
                {t('donate:paymentDetails')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div
                  className={styles.totalCost}
                  style={{ color: styles.light }}
                >
                  {getFormatedCurrency(
                    i18n.language,
                    currency,
                    treeCount * treeCost
                  )}
                </div>
                <div
                  className={styles.totalCostText}
                  style={{ color: styles.light }}
                >
                  {t('donate:fortreeCountTrees', {
                    count: Number(treeCount),
                    treeCount: getFormattedNumber(
                      i18n.language,
                      Number(treeCount)
                    ),
                  })}
                </div>
              </div>
              <div className={styles.plantProjectName}>
                {t('common:to_project_by_tpo', {
                  projectName: project.name,
                  tpoName: project.tpo.name,
                })}
              </div>
            </div>
          </div>
        </div>

        {contactDetails && (
          <div className={styles.showContactDetails}>
            {contactDetails.companyName ? (
              <>
                <p className={styles.showContactDetailsName}>
                  {`${contactDetails.companyName}`}
                </p>
                <p className={styles.showContactDetailsAddress}>
                  {`${contactDetails.firstName} ${contactDetails.lastName}`}
                </p>
              </>
            ) : (
              <p className={styles.showContactDetailsName}>
                {`${contactDetails.firstName} ${contactDetails.lastName}`}
              </p>
            )}

            <p className={styles.showContactDetailsAddress}>
              {`${contactDetails.address}, ${contactDetails.city}`}
            </p>
            <p className={styles.showContactDetailsAddress}>
              {`${contactDetails.zipCode}, ${t(
                'country:' + contactDetails.country.toLowerCase()
              )}`}
            </p>
            <p className={styles.showContactDetailsAddress}>
              {`${contactDetails.email}`}
            </p>

            {giftDetails && giftDetails.recipientName && (
              <div style={{ marginTop: '12px', fontStyle: 'italic' }}>
                <p className={styles.showContactDetailsName}>
                  {directGift && directGift.type === 'individual'
                    ? t('donate:giftToName')
                    : t('donate:thisDonationSupports')}{' '}
                  {giftDetails.recipientName}
                </p>
                {giftDetails.email && (
                  <p className={styles.showContactDetailsAddress}>
                    {giftDetails.email}
                  </p>
                )}
                {giftDetails.giftMessage && (
                  <p className={styles.showContactDetailsAddress}>
                    {giftDetails.giftMessage}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {paymentError && (
          <div className={styles.paymentError}>{paymentError}</div>
        )}

        <div className={styles.treeDonationContainer}>
          {!contactDetails.companyName && contactDetails.companyName === '' ? (
            askpublishName ? (
              <div className={styles.isCompany}>
                <label htmlFor="publishName" className={styles.isCompanyText}>
                  {t('donate:askPublishName')}
                </label>
                <ToggleSwitch
                  id="publishName"
                  checked={publishName}
                  onChange={() => {
                    setpublishName(!publishName);
                  }}
                  name="checkedB"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              </div>
            ) : (
              <div className={styles.isCompany}>
                <label
                  className={styles.isCompanyText}
                  style={{ textAlign: 'center' }}
                >
                  {t('donate:nameAlreadyPublished')}
                </label>
              </div>
            )
          ) : null}

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
              paypalCurrencies.includes(currency) &&
              paymentSetup?.gateways.paypal
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
                    totalCost={getFormatedCurrency(
                      i18n.language,
                      currency,
                      treeCount * treeCost
                    )}
                    onPaymentFunction={(data) =>
                      onSubmitPayment('stripe', data)
                    }
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
                    donationUid={donationUid}
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
      </div>
    )
  ) : (
    <></>
  );
}

export default PaymentDetails;
