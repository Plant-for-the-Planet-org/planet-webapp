import React, { useMemo, useState, useEffect } from 'react';
import {
  useStripe,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';

const useOptions = (paymentRequest) => {
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

const usePaymentRequest = ({ options, onPaymentMethod }) => {
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

const PaymentRequestForm = () => {
  const paymentRequest = usePaymentRequest({
    options: {
      country: 'DE',
      currency: 'eur',
      total: {
        label: 'Demo total',
        amount: 1000,
      },
    },
    onPaymentMethod: ({ complete, paymentMethod, ...data }) => {
      console.log('[PaymentMethod]', paymentMethod);
      console.log('[Customer Data]', data);
      complete('success');
    },
  });
  const options = useOptions(paymentRequest);

  if (!paymentRequest) {
    return null;
  }

  return (
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
  );
};

export default PaymentRequestForm;
