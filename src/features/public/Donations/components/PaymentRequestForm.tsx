import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useMemo, useState } from 'react';

export const useOptions = (paymentRequest: null) => {
  const typeOfButton = "donate";
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
  country: string; currency: String; amount: number; onPaymentFunction: Function;
}
export const PaymentRequestCustomButton = ({ country, currency, amount, onPaymentFunction }: PaymentButtonProps) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  useEffect(() => {
    if (stripe && paymentRequest === null) {

      const pr = stripe.paymentRequest({
        country: country,
        currency: currency.toLowerCase(),
        total: {
          label: 'Trees donated to Plant for the Planet',
          amount: amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      setPaymentRequest(pr);
    }
  }, [stripe, paymentRequest]);

  useEffect(() => {
    if (stripe && paymentRequest !== null) {
      setPaymentRequest(null);
      setCanMakePayment(false)
    }
  }, [country, currency, amount]);

  useEffect(() => {
    let subscribed = true;
    if (paymentRequest) {
      paymentRequest?.canMakePayment().then((res: any) => {
        if (res && subscribed) {
          setCanMakePayment(true);
        }
      });
    }

    return () => {
      subscribed = false;
    };
  }, [paymentRequest]);

  useEffect(() => {
    if (paymentRequest) {
      paymentRequest?.on('paymentmethod',
        ({ complete, paymentMethod, ...data }: any) => {
          onPaymentFunction(paymentMethod, paymentRequest);
          complete('success');
        });
    }
    return () => {
      if (paymentRequest) {
        paymentRequest?.off('paymentmethod',
          ({ complete, paymentMethod, ...data }: any) => {
            onPaymentFunction(paymentMethod, paymentRequest);
            complete('success');
          });
      }
    };
  }, [paymentRequest, onPaymentFunction]);

  const options = useOptions(paymentRequest);

  return canMakePayment ? paymentRequest ? (

    <PaymentRequestButtonElement
      className="PaymentRequestButton"
      options={options}
      onReady={() => {
        console.log('PaymentRequestButton [ready]');
      }}
      onClick={(event) => {
        console.log('PaymentRequestButton [click]', event);
      }}
      onBlur={() => {
        console.log('PaymentRequestButton [blur]');
      }}
      onFocus={() => {
        console.log('PaymentRequestButton [focus]');
      }}
    />
  ) : <p></p> : <p></p>;
}