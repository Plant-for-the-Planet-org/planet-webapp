import {
  PaymentRequestButtonElement,
  useStripe,
} from '@stripe/react-stripe-js';
import { useEffect, useMemo, useState } from 'react';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import styles from './../../styles/Donations.module.scss';
import i18next from '../../../../../i18n';
import getStripe from '../../../../utils/stripe/getStripe';
import { Elements } from '@stripe/react-stripe-js';

const { useTranslation } = i18next;

export const useOptions = (paymentRequest: null) => {
  const typeOfButton = 'donate';
  const options = useMemo(
    () => ({
      paymentRequest,
      style: {
        paymentRequestButton: {
          theme: 'dark',
          height: '36px',
          type: typeOfButton,
        },
      },
    }),
    [paymentRequest]
  );

  return options;
};

interface PaymentButtonProps {
  country: string;
  currency: String;
  amount: number;
  onPaymentFunction: Function;
  continueNext: Function | null;
}
export const PaymentRequestCustomButton = ({
  country,
  currency,
  amount,
  onPaymentFunction,
  continueNext
}: PaymentButtonProps) => {
  const { t, ready } = useTranslation(['donate', 'common']);

  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false)
  const stripeAllowedCountries = [
    'AE',
    'AT',
    'AU',
    'BE',
    'BG',
    'BR',
    'CA',
    'CH',
    'CI',
    'CR',
    'CY',
    'CZ',
    'DE',
    'DK',
    'DO',
    'EE',
    'ES',
    'FI',
    'FR',
    'GB',
    'GR',
    'GT',
    'HK',
    'HU',
    'ID',
    'IE',
    'IN',
    'IT',
    'JP',
    'LT',
    'LU',
    'LV',
    'MT',
    'MX',
    'MY',
    'NL',
    'NO',
    'NZ',
    'PE',
    'PH',
    'PL',
    'PT',
    'RO',
    'SE',
    'SG',
    'SI',
    'SK',
    'SN',
    'TH',
    'TT',
    'US',
    'UY',
  ];

  useEffect(() => {
    if (
      stripe &&
      !paymentRequest &&
      stripeAllowedCountries.includes(country)
    ) {      
      const pr = stripe.paymentRequest({
        country: country,
        currency: currency.toLowerCase(),
        total: {
          label: ready ? t('donate:treeDonationWithPFP') : '',
          amount: amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      setPaymentRequest(pr);
    }
  }, [stripe, paymentRequest]);

  useEffect(() => {
    if (stripe && paymentRequest) {
      setPaymentRequest(null);
      setCanMakePayment(false);
      setPaymentLoading(false);
    }
  }, [country, currency, amount]);

  useEffect(() => {
    let subscribed = true;
    if (paymentRequest) {
      paymentRequest.canMakePayment().then((res: any) => {
        if (res && subscribed) {
          setCanMakePayment(true);
        }
      });
    }

    return () => {
      setCanMakePayment(false);
      subscribed = false;
    };
  }, [paymentRequest]);

  useEffect(() => {

    if (paymentRequest && !paymentLoading) {
      setPaymentLoading(true)
      paymentRequest.on(
        'paymentmethod',
        ({ complete, paymentMethod, ...data }: any) => {
          
          onPaymentFunction(paymentMethod, paymentRequest);
          complete('success');
          setPaymentLoading(false)
        }
      );
    }
    return () => {
      if (paymentRequest && !paymentLoading) {
        paymentRequest.off(
          'paymentmethod',
          ({ complete, paymentMethod, ...data }: any) => {
            onPaymentFunction(paymentMethod, paymentRequest);
            complete('success');
            setPaymentLoading(false)
          }
        );
      }
    };
  }, [paymentRequest, onPaymentFunction]);

  const options = useOptions(paymentRequest);

  return ready ? (
    stripeAllowedCountries.includes(country) &&
      canMakePayment &&
      paymentRequest ? (
        <div className={styles.actionButtonsContainer}
          style={{ justifyContent: continueNext ? "space-between" : "center" }}>
          <div style={{ width: '150px',borderRadius:'18px' }}>
            <PaymentRequestButtonElement
              className="PaymentRequestButton"
              options={options}
              onReady={() => {
                // console.log('PaymentRequestButton [ready]');
              }}
              onClick={(event) => {
                // console.log('PaymentRequestButton [click]', event);
              }}
              onBlur={() => {
                // console.log('PaymentRequestButton [blur]');
              }}
              onFocus={() => {
                // console.log('PaymentRequestButton [focus]');
              }}
            />
          </div>
          {continueNext && (
            <AnimatedButton
              onClick={() => continueNext()}
              className={styles.continueButton}
              style={{borderRadius:'6px', maxWidth:'48%',height:'32px!important'}}
            >
              {t('common:continue')}
            </AnimatedButton>
          )}

        </div>
      ) : continueNext ? (
        <div
          className={styles.actionButtonsContainer}
          style={{ justifyContent: 'center' }}
        >
          <button
            onClick={() => continueNext()}
            className="primaryButton"
            id="treeDonateContinue"
            style={{borderRadius: "10px"}}

          >
            {t('common:continue')}
          </button>
        </div>
      ) : null) : null;
};

interface NativePayProps {
  country: string;
  currency: String;
  amount: number;
  onPaymentFunction: Function;
  continueNext: Function | null;
  paymentSetup: Object;
}
export const NativePay = ({
  country,
  currency,
  amount,
  onPaymentFunction,
  continueNext,
  paymentSetup
 }: NativePayProps) => {
  
  const [stripePromise,setStripePromise] = useState(()=>getStripe(paymentSetup))

  useEffect(()=>{
    const fetchStripeObject = async () => {
      if (paymentSetup) {
        const res = ()=> getStripe(paymentSetup);
        // When we have got the Stripe object, pass it into our useState.
        setStripePromise(res);
      }
    };
    setStripePromise(null);
    fetchStripeObject();
  },[paymentSetup])

  if(!stripePromise){
    return <></>;
  }

  return (
    <Elements stripe={stripePromise} key={paymentSetup?.gateways?.stripe?.authorization.accountId}>
      <PaymentRequestCustomButton
        country={country}
        currency={currency}
        amount={amount}
        onPaymentFunction={onPaymentFunction}
        continueNext={continueNext}
      />
    </Elements>
  )
}