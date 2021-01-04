import { FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  IbanElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import React, { ReactElement } from 'react';
import CreditCard from '../../../../public/assets/images/icons/donation/CreditCard';
import BackArrow from '../../../../public/assets/images/icons/headerIcons/BackArrow';
import { getCardBrand } from '../../../utils/stripe/stripeHelpers';
import PaymentProgress from '../../common/ContentLoaders/Donations/PaymentProgress';
import AnimatedButton from '../../common/InputTypes/AnimatedButton';
import { PaymentDetailsProps } from '../../common/types/donations';
import styles from './../styles/PaymentDetails.module.scss';
import { createDonation, payDonation, payWithCard } from '../components/treeDonation/PaymentFunctions';
import i18next from '../../../../i18n';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import { getFormattedNumber } from '../../../utils/getFormattedNumber';
import PaypalIcon from '../../../../public/assets/images/icons/donation/PaypalIcon';
import Paypal from '../../legacyDonations/components/Paypal';
import { paypalCurrencies } from '../../../utils/paypalCurrencies';

const { useTranslation } = i18next;

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
const getInputOptions = (placeholder: string) => {
  const ObjectM = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: styles.primaryFontFamily,
        fontSize: '16px',
        '::placeholder': {
          color: '#2F3336',
          fontFamily: styles.primaryFontFamily,
          fontSize: '14px',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    placeholder: placeholder,
  };
  return ObjectM;
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
  const [saveCardDetails, setSaveCardDetails] = React.useState(false);
  const [paypalEnabled, setPaypalEnabled] = React.useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [cardNumber, setCardNumber] = React.useState(false);
  const [cardCvv, setCardCvv] = React.useState(false);
  const [cardDate, setCardDate] = React.useState(false);

  const [showPaymentForm, setShowPaymentForm] = React.useState('CARD');
  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);

  React.useEffect(() => {
    setPaymentType('CARD');
  }, []);

  const [isSepa, setIsSepa] = React.useState(false);

  const [paymentError, setPaymentError] = React.useState('');
  const [showContinue, setShowContinue] = React.useState(false);
  const [showBrand, setShowBrand] = React.useState('');

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
  React.useEffect(() => {
    const cardNumberElement = elements!.getElement(CardNumberElement);
    cardNumberElement!.on('change', ({ error, complete, brand }) => {
      if (error) {
        setShowContinue(false);
      } else if (complete) {
        setShowBrand(brand);
        const cardExpiryElement = elements!.getElement(CardExpiryElement);
        cardExpiryElement!.on('change', ({ error, complete }) => {
          if (error) {
            setShowContinue(false);
          } else if (complete) {
            const cardCvcElement = elements!.getElement(CardCvcElement);
            cardCvcElement!.on('change', ({ error, complete }) => {
              if (error) {
                setShowContinue(false);
              } else if (complete) {
                setShowContinue(true);
              }
            });
          }
        });
      }
    });
  }, [CardNumberElement, CardExpiryElement, CardCvcElement]);
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    setShowContinue(false);
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    let paymentMethod: any;

    if (paymentType === 'CARD') {
      const cardElement = elements!.getElement(CardNumberElement);
      setCardCvv(false);
      setCardDate(false);
      setCardNumber(false);
      cardElement!.on('change', ({ error }) => {
        if (error) {
          // setPaymentError(error.message);
          setPaymentError('Could not process your payment, please try again.');
          return;
        }
      });
      const payload = await stripe
        .createPaymentMethod({
          type: 'card',
          card: cardElement!,
        })
        .catch((error) => {
          setPaymentError('Could not process your payment, please try again.');
          return;
        });
      paymentMethod = payload.paymentMethod;
      // Add payload error if failed
    } else if (paymentType === 'SEPA') {
      const payload = await stripe
        .createPaymentMethod({
          type: 'sepa_debit',
          sepa_debit: elements.getElement(IbanElement)!,
          billing_details: {
            name: contactDetails.firstName,
            email: contactDetails.email,
          },
        })
        .catch((error) => {
          setPaymentError(error.message);
          return;
        });
      paymentMethod = payload.paymentMethod;
      // Add payload error if failed
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

  const handleChange = (change) => {
    if (change.complete === true) {
      setCardNumber(true);
    } else {
      setCardNumber(false);
    }
  };
  const handleChangeCvv = (change) => {
    if (change.complete === true) {
      setCardCvv(true);
    } else {
      setCardCvv(false);
    }
  };
  const handleChangeCardDate = (change) => {
    if (change.complete === true) {
      setCardDate(true);
    } else {
      setCardDate(false);
    }
  };

  const validateCard = () => {
    if (cardNumber && cardCvv && cardDate) {
      setShowContinue(true);
    } else {
      setShowContinue(false);
    }
  };

  React.useEffect(() => {
    validateCard();
  }, [cardDate, cardNumber, cardCvv]);

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
        if (res.code === 400) {
          setIsPaymentProcessing(false);
          setPaymentError(res.message);
          setPaypalProcessing(false)
        } else if (res.code === 500) {
          setIsPaymentProcessing(false);
          setPaypalProcessing(false);
          setPaymentError('Something went wrong please try again soon!');
        } else if (res.code === 503) {
          setIsPaymentProcessing(false);
          setPaypalProcessing(false);
          setPaymentError(
            'App is undergoing maintenance, please check status.plant-for-the-planet.org for details',
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
            setPaymentError('Something went wrong please try again soon!');
            return;
          } if (res.code === 503) {
            setIsPaymentProcessing(false);
            setPaymentError(
              'App is undergoing maintenance, please check status.plant-for-the-planet.org for details',
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

          } else if (res.status === 'action_required') {
            const clientSecret = res.response.payment_intent_client_secret;
            const donationID = res.id;
            const stripe = window.Stripe(
              process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
              {
                stripeAccount: res.response.account,
              },
            );
            if (stripe) {
              await stripe.handleCardAction(clientSecret).then((res) => {
                if (res.error) {
                  setIsPaymentProcessing(false);
                  setPaymentError(res.error.message);
                } else {
                  const payDonationData = {
                    paymentProviderRequest: {
                      account: paymentSetup.gateways.stripe.account,
                      gateway: 'stripe_pi',
                      source: {
                        id: res.paymentIntent.id,
                        object: 'payment_intent',
                      },
                    },
                  };
                  payDonation(payDonationData, donationID, token).then((res) => {
                    if (res.paymentStatus === 'success') {
                      setIsPaymentProcessing(false);
                      setPaymentType('Paypal')
                      setDonationStep(4)

                    } else {
                      setIsPaymentProcessing(false);
                      setPaymentError(res.error ? res.error.message : res.message);
                    }
                  });
                }
              });
            }
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
          <div
            onClick={() => setDonationStep(2)}
            className={styles.headerBackIcon}
          >
            <BackArrow />
          </div>
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

        {
          <div className={styles.paymentModeContainer} onClick={() => setShowPaymentForm('CARD')}>
            <div className={styles.paymentModeHeader}>
              {showBrand !== '' ? getCardBrand(showBrand) : <CreditCard />}
              <div className={styles.paymentModeTitle}>
                {t('donate:creditDebitCard')}
              </div>
              {/* <div className={styles.paymentModeFee}>
            <div className={styles.paymentModeFeeAmount}>€ 0,76 fee</div>
            <InfoIcon />
          </div> */}
            </div>

            {showPaymentForm === 'CARD' && (
              <>
                <div className={styles.formRow}>
                  <FormControlNew variant="outlined">
                    <CardNumberElement
                      id="cardNumber"
                      options={getInputOptions(t('donate:cardNumber'))}
                      onChange={handleChange}
                    />
                  </FormControlNew>
                </div>
                <div className={styles.formRow}>
                  <FormControlNew variant="outlined">
                    <CardExpiryElement
                      id="expiry"
                      options={getInputOptions(t('donate:expDate'))}
                      onChange={handleChangeCardDate}
                    />
                  </FormControlNew>
                  <div style={{ width: '20px' }}></div>
                  <FormControlNew variant="outlined">
                    <CardCvcElement id="cvc" options={getInputOptions('CVV')} onChange={handleChangeCvv} />
                  </FormControlNew>
                </div>
                {/* <div className={styles.saveCard}>
          <div className={styles.saveCardText}>
            Save card for future Donations
          </div>
          <ToggleSwitch
            checked={saveCardDetails}
            onChange={() => setSaveCardDetails(!saveCardDetails)}
            name="checkedB"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div> */}
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
              </>
            )}
          </div>
        }

        { paypalCurrencies.includes(currency) && paymentSetup?.gateways.paypal &&
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

        {/* <div className={styles.paymentModeContainer}>
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
        </div>)}
      </div> */}

        {/* <div className={styles.horizontalLine} /> */}


      </div>
    )
  ) : null;
}

export default PaymentDetails;
