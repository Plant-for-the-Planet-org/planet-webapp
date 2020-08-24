import { FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement, IbanElement, useElements, useStripe
} from '@stripe/react-stripe-js';
import React, { ReactElement } from 'react';
import CreditCard from '../../../../assets/images/icons/donation/CreditCard';
import InfoIcon from '../../../../assets/images/icons/donation/InfoIcon';
import PaypalIcon from '../../../../assets/images/icons/donation/PaypalIcon';
import BackArrow from '../../../../assets/images/icons/headerIcons/BackArrow';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import styles from './../styles/PaymentDetails.module.scss';
import { createDonation, payDonation } from './treeDonation/PaymentFunctions';
const FormControlNew = withStyles({
  root: {
    width: '100%',
    backgroundColor: '#F2F2F7',
    border: '0px!important',
    borderRadius: '10px',
    fontFamily: 'Raleway',
    padding: '18.5px',
  },
})(FormControl);
const ELEMENT_OPTIONS = {
  supportedCountries: ['SEPA'],
  style: {
    base: {
      fontSize: '18px',
      color: '#424770',
      letterSpacing: '0.025em',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};
const getInputOptions = (placeholder: String) => {
  const ObjectM = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Raleway',
        fontSize: "16px",
        "::placeholder": {
          color: '#2F3336',
          fontFamily: 'Raleway',
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
interface Props {
  project: Object;
  paymentSetup: any;
  treeCount: number;
  treeCost: number;
  currency: String;
  setDonationStep: Function;
  contactDetails: Object;
  isGift: Boolean;
  giftDetails: Object;
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
  giftDetails
}: Props): ReactElement {
  const [saveCardDetails, setSaveCardDetails] = React.useState(false);
  const [paypalEnabled, setPaypalEnabled] = React.useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const [paymentError, setPaymentError] = React.useState(null);
  // const handleSubmit = async (event: { preventDefault: () => void; }) => {
  //   event.preventDefault();
  //   const { error, paymentMethod } = await stripe.createPaymentMethod({
  //     type: 'card',
  //     card: elements.getElement(CardNumberElement),
  //   });

  //   let createDonationData = {
  //     type: 'trees',
  //     project: project.id,
  //     treeCount: treeCount,
  //     amount: treeCost * treeCount,
  //     currency: currency,
  //     donor: {
  //       firstname: contactDetails.firstName,
  //       lastname: contactDetails.lastName,
  //       email: contactDetails.email,
  //       address: contactDetails.address,
  //       zipCode: contactDetails.zipCode,
  //       city: contactDetails.city,
  //       country: contactDetails.country,
  //     },
  //   }
  //   let gift = {
  //     gift: {
  //       type: 'invitation',
  //       recipientName: giftDetails.firstName,
  //       recipientEmail: giftDetails.email,
  //       message: giftDetails.giftMessage
  //     }
  //   }
  //   if (isGift) {
  //     createDonationData = {
  //       ...createDonationData,
  //       ...gift
  //     }
  //   }


  //   createDonation(createDonationData).then((res) => {
  //     // Code for Payment API
  //     const payDonationData = {
  //       paymentProviderRequest: {
  //         account: paymentSetup.gateways.stripe.account,
  //         gateway: 'stripe_pi',
  //         source: {
  //           id: paymentMethod.id,
  //           object: 'payment_method',
  //         },
  //       },
  //     };

  //     payDonation(payDonationData, res.id);
  //   });
  //   console.log('PM', paymentMethod)
  //   // if(error){
  //   //   setPaymentError(error)
  //   // }
  // };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const ibanElement = elements.getElement(IbanElement);

    const payload = await stripe.createPaymentMethod({
      type: 'sepa_debit',
      sepa_debit: ibanElement,
      billing_details: {
        name: contactDetails.firstName,
        email: contactDetails.email,
      },
    });

    if (payload.error) {
      console.log('[error]', payload.error);
      setPaymentError(payload.error.message);
      // setPaymentMethod(null);
    } else {
      console.log('[PaymentMethod]', payload.paymentMethod);
      // setPaymentMethod(payload.paymentMethod);
      setPaymentError(null);
      const paymentMethod = payload.paymentMethod

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
          country: contactDetails.country,
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

        payDonation(payDonationData, res.id);
      });
    }
  };


  return (
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
          <div className={styles.paymentModeTitle}>Credit Card</div>
          <div className={styles.paymentModeFee}>
            <div className={styles.paymentModeFeeAmount}>€ 0,76 fee</div>
            <InfoIcon />
          </div>
        </div>

        <div className={styles.formRow}>
          <FormControlNew variant="outlined">
            <CardNumberElement
              id="cardNumber"
              options={getInputOptions('Credit Card Number')}
            />

          </FormControlNew>

        </div>
        <div className={styles.formRow}>
          <FormControlNew variant="outlined">
            <CardExpiryElement
              id="expiry"
              options={getInputOptions('Exp. Date')}
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
        <div className={styles.saveCard}>
          <div className={styles.saveCardText}>
            Save card for future Donations
          </div>
          <ToggleSwitch
            checked={saveCardDetails}
            onChange={() => setSaveCardDetails(!saveCardDetails)}
            name="checkedB"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>
      </div>

      <div className={styles.paymentModeContainer}>
        <div className={styles.paymentModeHeader}>
          {/* <PaypalButton /> */}
          <PaypalIcon />
          <div className={styles.paymentModeTitle}>Paypal</div>
          <div className={styles.paymentModeFee}>
            <div className={styles.paymentModeFeeAmount}>€ 0,76 fee</div>
            <InfoIcon />
          </div>
        </div>
      </div>

      {/* <div className={styles.paymentModeContainer}>
        <div className={styles.paymentModeHeader}>
          <SepaIcon />
          <div className={styles.paymentModeTitle}>SEPA Direct Debit</div>
          <div className={styles.paymentModeFee}>
            <div className={styles.paymentModeFeeAmount}>€ 0,35 fee</div>
            <InfoIcon />
          </div>
        </div>
      </div> */}
      <FormControlNew variant="outlined">
        <IbanElement
          id="iban"
          options={ELEMENT_OPTIONS}
        />
      </FormControlNew>

      <div className="mandate-acceptance">
        By providing your IBAN and confirming this payment, you authorise
        (A) Rocketship Inc and Stripe, our payment service provider, to send
        instructions to your bank to debit your account and (B) your bank to
        debit your account in accordance with those instructions. You are
        entitled to a refund from your bank under the terms and conditions of
        your agreement with your bank. A refund must be claimed within 8 weeks
        starting from the date on which your account was debited.
      </div>
      <div className={styles.horizontalLine} />

      <div className={styles.finalTreeCount}>
        <div className={styles.totalCost}>
          {currency} {(treeCount * treeCost).toFixed(2)}{' '}
        </div>
        <div className={styles.totalCostText}>for {treeCount} Trees</div>
      </div>

      <div onClick={handleSubmit} className={styles.actionButtonsContainer}>
        <div className={styles.continueButton}>Continue</div>
      </div>
    </div>
  );
}

export default PaymentDetails;
