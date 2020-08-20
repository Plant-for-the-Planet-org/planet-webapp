import { useStripe } from '@stripe/react-stripe-js';
import { useEffect, useMemo, useState } from 'react';

export const useOptions = (paymentRequest) => {
  const options = useMemo(
    () => ({
      paymentRequest,
      style: {
        paymentRequestButton: {
          theme: 'dark',
          height: '36px',
          type: 'donate',
        },
      },
    }),
    [paymentRequest]
  );

  return options;
};

export const usePaymentRequest = ({ options, onPaymentMethod }) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  useEffect(() => {
    if (stripe && paymentRequest === null) {
      const pr = stripe.paymentRequest(options);
      setPaymentRequest(pr);
    }
  }, [stripe, options, paymentRequest]);

  useEffect(() => {
    let subscribed = true;
    if (paymentRequest) {
      paymentRequest.canMakePayment().then((res) => {
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
      paymentRequest.on('paymentmethod', onPaymentMethod);
    }
    return () => {
      if (paymentRequest) {
        paymentRequest.off('paymentmethod', onPaymentMethod);
      }
    };
  }, [paymentRequest, onPaymentMethod]);

  return canMakePayment ? paymentRequest : null;
};
