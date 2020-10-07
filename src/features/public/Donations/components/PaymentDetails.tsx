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
import Sugar from 'sugar';
import CreditCard from '../../../../assets/images/icons/donation/CreditCard';
import BackArrow from '../../../../assets/images/icons/headerIcons/BackArrow';
import { getCardBrand } from '../../../../utils/stripe/stripeHelpers';
import PaymentProgress from '../../../common/ContentLoaders/Donations/PaymentProgress';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { PaymentDetailsProps } from './../../../common/types/donations';
import styles from './../styles/PaymentDetails.module.scss';
import { payWithCard } from './treeDonation/PaymentFunctions';
import i18next from '../../../../../i18n';

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
}: PaymentDetailsProps): ReactElement {
  const { t } = useTranslation(['donate', 'common']);

  const [saveCardDetails, setSaveCardDetails] = React.useState(false);
  const [paypalEnabled, setPaypalEnabled] = React.useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);

  React.useEffect(() => {
    setPaymentType('CARD');
  }, []);

  const [isSepa, setIsSepa] = React.useState(false);

  const [paymentError, setPaymentError] = React.useState('');
  const [showContinue, setShowContinue] = React.useState(false);
  const [showBrand, setShowBrand] = React.useState('');
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
    };
    payWithCard({ ...payWithCardProps });
  };

  return isPaymentProcessing ? (
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

      {
        <div className={styles.paymentModeContainer}>
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

          <div className={styles.formRow}>
            <FormControlNew variant="outlined">
              <CardNumberElement
                id="cardNumber"
                options={getInputOptions(t('donate:cardNumber'))}
              />
            </FormControlNew>
          </div>
          <div className={styles.formRow}>
            <FormControlNew variant="outlined">
              <CardExpiryElement
                id="expiry"
                options={getInputOptions(t('donate:expDate'))}
              />
            </FormControlNew>
            <div style={{ width: '20px' }}></div>
            <FormControlNew variant="outlined">
              <CardCvcElement id="cvc" options={getInputOptions('CVV')} />
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
        </div>
      }

      {/* <div className={styles.paymentModeContainer}>
          <div className={styles.paymentModeHeader}>
            <PaypalButton />
            <PaypalIcon />
            <div className={styles.paymentModeTitle}>Paypal</div>
            <div className={styles.paymentModeFee}>
            <div className={styles.paymentModeFeeAmount}>€ 0,76 fee</div>
            <InfoIcon />
          </div>
          </div>
        </div> */}

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

      <div className={styles.horizontalLine} />
      <div className={styles.finalTreeCount}>
        <div className={styles.totalCost}>
          {currency} {Sugar.Number.format(Number(treeCount * treeCost), 2)}
        </div>
        <div className={styles.totalCostText}>
          {t('donate:fortreeCountTrees', {
            treeCount: Sugar.Number.format(Number(treeCount)),
          })}
        </div>
      </div>
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
    </div>
  );
}

export default PaymentDetails;
