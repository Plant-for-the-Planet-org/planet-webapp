import React, { ReactElement } from 'react';
import BackArrow from '../../../../public/assets/images/icons/headerIcons/BackArrow';
import PaymentProgress from '../../common/ContentLoaders/Donations/PaymentProgress';
import { PaymentDetailsProps } from '../../common/types/donations';
import styles from './../styles/PaymentDetails.module.scss';
import { createDonation, payDonation, payWithCard } from '../components/PaymentFunctions';
import i18next from '../../../../i18n';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import { getFormattedNumber } from '../../../utils/getFormattedNumber';
import PaypalIcon from '../../../../public/assets/images/icons/donation/PaypalIcon';
import Paypal from '../components/paymentMethods/Paypal';
import { paypalCurrencies } from '../../../utils/paypalCurrencies';
import CardPayments from '../components/paymentMethods/CardPayments';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '../../../utils/stripe/getStripe';

const { useTranslation } = i18next;

const ELEMENT_OPTIONS = {
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
  recurrencyMnemonic
}: PaymentDetailsProps): ReactElement {
  const { t, i18n, ready } = useTranslation(['donate', 'common']);
  const [paypalEnabled, setPaypalEnabled] = React.useState(false);

  const [showPaymentForm, setShowPaymentForm] = React.useState('CARD');
  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);

  React.useEffect(() => {
    setPaymentType('CARD');
  }, []);

  const [isSepa, setIsSepa] = React.useState(false);

  const [paymentError, setPaymentError] = React.useState('');

  const [donationID, setDonationID] = React.useState(null);
  const [paypalProcessing, setPaypalProcessing] = React.useState(false);

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

  // const createPaymentMethodSepa = (sepaElement: any, contactDetails: any) => {
  //   return stripe?.createPaymentMethod({
  //     type: 'sepa_debit',
  //     sepa_debit: sepaElement,
  //     billing_details: {
  //       name: contactDetails.firstName,
  //       email: contactDetails.email,
  //     },
  //   })
  // }

  // Code for SEPA
  // else if (paymentType === 'SEPA') {
  //   const sepaElement = elements.getElement(IbanElement)!;
  //   let payload = await createPaymentMethodSepa(sepaElement, contactDetails);
  //   paymentMethod = payload.paymentMethod;
  //   // Add payload error if failed
  // }


  const onPaymentFunction =  (gateway:any,paymentMethod: any) => {
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
      token: token,
      recurrencyMnemonic
    };
    payWithCard({ ...payWithCardProps });
  };

  // Function to process paypal donations, this will create a donation ID
  const createDonationWithPaypal = () => {
    setPaypalProcessing(true)
    setShowPaymentForm('PAYPAL');
    let createDonationData = {
      type: 'trees',
      project: project.id,
      treeCount,
      amount: Math.round((treeCost * treeCount + Number.EPSILON) * 100) / 100,
      currency,
      donor: { ...donorDetails },
    };
    let taxDeductionCountry = isTaxDeductible ? country : null;
    recurrencyMnemonic
    if (recurrencyMnemonic) {
      createDonationData = {
        ...createDonationData,
        recurrencyMnemonic,
      };
    }
    if (taxDeductionCountry) {
      createDonationData = {
        ...createDonationData,
        taxDeductionCountry,
      };
    }

    if (isGift) {
      if (giftDetails.type === 'invitation') {
        createDonationData = {
          ...createDonationData,
          ...{
            gift: {
              type: 'invitation',
              recipientName: giftDetails.recipientName,
              recipientEmail: giftDetails.email,
              message: giftDetails.giftMessage,
            }
          },
        };
      } else if (giftDetails.type === 'direct') {
        createDonationData = {
          ...createDonationData,
          ...{
            gift: {
              type: 'direct',
              recipientTreecounter: giftDetails.recipientTreecounter,
              message: giftDetails.giftMessage,
            }
          },
        };
      } else if (giftDetails.type === 'bulk') {
        // for multiple receipients
      }
    }

    createDonation(createDonationData, token)
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
          setShowPaymentForm('PAYPAL');
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
            setPaymentType('Paypal')
            setDonationStep(4)

          }
        })
        .catch((error) => {
          setIsPaymentProcessing(false);
          setPaymentError(error.message);
        });
    }
  }

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
            {t(`donate:fortreeCountTrees${recurrencyMnemonic}`, {
              treeCount: getFormattedNumber(i18n.language, Number(treeCount)),
            })}
          </div>
          <Elements stripe={getStripe(paymentSetup)}>
              <CardPayments onPaymentFunction={(data)=> onPaymentFunction('stripe',data)} paymentType={paymentType} setPaymentType={setPaymentType} />
          </Elements>

          {paypalCurrencies.includes(currency) && paymentSetup?.gateways.paypal &&
            <div className={styles.paymentModeContainer} onClick={() => createDonationWithPaypal()}>
              <div className={styles.paymentModeHeader}>
                <PaypalIcon />
                <div className={styles.paymentModeTitle}>Paypal</div>
                {paypalProcessing && <div className={styles.spinner} />}
              </div>

              { paypalCurrencies.includes(currency) && recurrencyMnemonic === 'none' &&  paymentSetup?.gateways.paypal &&
                <div className={styles.paymentModeContainer} onClick={() => createDonationWithPaypal()}>
                  <div className={styles.paymentModeHeader}>
                  <PaypalIcon />
                  <div className={styles.paymentModeTitle}>Paypal</div>
                    {paypalProcessing && <div className={styles.spinner} />}
                  </div>

                  {showPaymentForm === 'PAYPAL' && (
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
          }

        {/* 
          <div className={styles.paymentModeContainer}>
            <div onClick={() => {
              setIsSepa(!isSepa), setPaymentType('SEPA')
            }} className={styles.paymentModeHeader}>
              <SepaIcon />
              <div className={styles.paymentModeTitle}>SEPA Direct Debit</div>
              <div className={styles.paymentModeFee}>
              <div className={styles.paymentModeFeeAmount}>€ 0,35 fee</div>
              <InfoIcon />
            </div>
          </div>

        {isSepa && (<div>
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
              options={ELEMENT_OPTIONS}
            />
          </FormControlNew>
        */}
        </div> 

      </div>
    )
  ) : <></>;
}

export default PaymentDetails;
