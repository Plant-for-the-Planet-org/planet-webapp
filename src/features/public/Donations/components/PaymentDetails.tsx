import { FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement, IbanElement, useElements, useStripe
} from '@stripe/react-stripe-js';
import React, { ReactElement } from 'react';
import CreditCard from '../../../../assets/images/icons/donation/CreditCard';
import PaypalIcon from '../../../../assets/images/icons/donation/PaypalIcon';
import BackArrow from '../../../../assets/images/icons/headerIcons/BackArrow';
import PaymentProgress from '../../../common/ContentLoaders/Donations/PaymentProgress';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { PaymentDetailsProps } from './../../../common/types/donations';
import styles from './../styles/PaymentDetails.module.scss';
import { createDonation, payDonation } from './treeDonation/PaymentFunctions';

const FormControlNew = withStyles({
  root: {
    width: '100%',
    backgroundColor: '#F2F2F7',
    border: '0px!important',
    borderRadius: '10px',
    fontFamily: 'Raleway, sans-serif',
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
      fontFamily: 'Raleway, sans-serif',
      '::placeholder': {
        color: '#aab7c4',
        fontFamily: 'Raleway, sans-serif',
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
        color: "#32325d",
        fontFamily: 'Raleway, sans-serif',
        fontSize: "16px",
        "::placeholder": {
          color: '#2F3336',
          fontFamily: 'Raleway, sans-serif',
          fontSize: '14px',
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
    placeholder: placeholder
  };
  return ObjectM;
}


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
  paymentType, setPaymentType
}: PaymentDetailsProps): ReactElement {
  const [saveCardDetails, setSaveCardDetails] = React.useState(false);
  const [paypalEnabled, setPaypalEnabled] = React.useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false)

  React.useEffect(() => {
    setPaymentType('CARD')
  }, [])

  const [isSepa, setIsSepa] = React.useState(false)

  const [paymentError, setPaymentError] = React.useState(null);
  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    let paymentMethod: any;
    let error;

    if (paymentType === 'CARD') {
      const cardElement = elements!.getElement(CardNumberElement);
      const payload = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement!,
      });
      paymentMethod = payload.paymentMethod;
    } else if (paymentType === 'SEPA') {
      const payload = await stripe.createPaymentMethod({
        type: 'sepa_debit',
        sepa_debit: elements.getElement(IbanElement)!,
        billing_details: {
          name: contactDetails.firstName,
          email: contactDetails.email,
        },
      });
      paymentMethod = payload.paymentMethod;
    }
    setIsPaymentProcessing(true)
    let createDonationData = {
      type: 'trees',
      project: project.id,
      treeCount: treeCount,
      amount: treeCost * treeCount,
      currency: currency,
      donor: {
        firstname: contactDetails.firstName,
        lastname: contactDetails.lastName,
        email: contactDetails.email,
        address: contactDetails.address,
        zipCode: contactDetails.zipCode,
        city: contactDetails.city,
        country: contactDetails.country.toUpperCase(),
      },
    }
    let gift = {
      gift: {
        type: 'invitation',
        recipientName: giftDetails.firstName,
        recipientEmail: giftDetails.email,
        message: giftDetails.giftMessage
      }
    }
    if (isGift) {
      createDonationData = {
        ...createDonationData,
        ...gift
      }
    }
    createDonation(createDonationData).then((res) => {
      // Code for Payment API
      const payDonationData = {
        paymentProviderRequest: {
          account: paymentSetup.gateways.stripe.account,
          gateway: 'stripe_pi',
          source: {
            id: paymentMethod.id,
            object: 'payment_method',
          },
        },
      };

      payDonation(payDonationData, res.id).then((res) => {
        if (res.paymentStatus === 'success') {
          setIsPaymentProcessing(false)
          setDonationStep(4);
        }
      });
    });
    // if(error){
    //   setPaymentError(error)
    // }
  };

  return isPaymentProcessing ?
    <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
    : (
      <div className={styles.container}>
        <div className={styles.header}>
          <div
            onClick={() => setDonationStep(2)}
            className={styles.headerBackIcon}
          >
            <BackArrow />
          </div>
          <div className={styles.headerTitle}>Payment Details</div>
        </div>
        {paymentError && <div className={styles.paymentError}>
          Error, Payment failed. Please try again.
      </div>}


        <div className={styles.paymentModeContainer}>
          <div className={styles.paymentModeHeader}>
            <CreditCard />
            <div className={styles.paymentModeTitle}>Credit/Debit Card</div>
            {/* <div className={styles.paymentModeFee}>
            <div className={styles.paymentModeFeeAmount}>€ 0,76 fee</div>
            <InfoIcon />
          </div> */}
          </div>

          <div className={styles.formRow}>
            <FormControlNew variant="outlined">
              <CardNumberElement
                id="cardNumber"
                options={getInputOptions('Card Number')}
              />

            </FormControlNew>

          </div>
          <div className={styles.formRow}>
            <FormControlNew variant="outlined">
              <CardExpiryElement
                id="expiry"
                options={getInputOptions('Exp. Date (MM/YY)')}
              />

            </FormControlNew>
            <div style={{ width: '20px' }}></div>
            <FormControlNew variant="outlined">
              <CardCvcElement
                id="cvc"
                options={getInputOptions('CVV')}
              />

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

        <div className={styles.paymentModeContainer}>
          <div className={styles.paymentModeHeader}>
            {/* <PaypalButton /> */}
            <PaypalIcon />
            <div className={styles.paymentModeTitle}>Paypal</div>
            {/* <div className={styles.paymentModeFee}>
            <div className={styles.paymentModeFeeAmount}>€ 0,76 fee</div>
            <InfoIcon />
          </div> */}
          </div>
        </div>

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
            {currency} {(treeCount * treeCost).toFixed(2)}{' '}
          </div>
          <div className={styles.totalCostText}>for {treeCount} Trees</div>
        </div>
        <div onClick={handleSubmit} className={styles.actionButtonsContainer}>
          <AnimatedButton className={styles.continueButton}>Continue</AnimatedButton>
        </div>
      </div>
    );
}

export default PaymentDetails;
