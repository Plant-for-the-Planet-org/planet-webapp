import {
  PaymentRequestButtonElement,
  useStripe,
} from '@stripe/react-stripe-js';
import { useEffect, useMemo, useState } from 'react';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import styles from './../styles/TreeDonation.module.scss';
import i18next from '../../../../../i18n';

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
  continueNext: Function;
}
export const PaymentRequestCustomButton = ({
  country,
  currency,
  amount,
  onPaymentFunction,
  continueNext,
}: PaymentButtonProps) => {
  const { t } = useTranslation(['donate', 'common']);

  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
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
          label: t('donate:treeDonationWithPFP'),
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
    if (paymentRequest) {
      paymentRequest.on(
        'paymentmethod',
        ({ complete, paymentMethod, ...data }: any) => {
          onPaymentFunction(paymentMethod, paymentRequest);
          complete('success');
        }
      );
    }
    return () => {
      if (paymentRequest) {
        paymentRequest.off(
          'paymentmethod',
          ({ complete, paymentMethod, ...data }: any) => {
            onPaymentFunction(paymentMethod, paymentRequest);
            complete('success');
          }
        );
      }
    };
  }, [paymentRequest, onPaymentFunction]);

  const options = useOptions(paymentRequest);

  return stripeAllowedCountries.includes(country) &&
    canMakePayment &&
    paymentRequest ? (
    <div className={styles.actionButtonsContainer}>
      <div style={{ width: '150px' }}>
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
      </div>

      <AnimatedButton
        onClick={() => continueNext()}
        className={styles.continueButton}
      >
        {t('common:continue')}
      </AnimatedButton>
    </div>
  ) : (
    <div
      className={styles.actionButtonsContainer}
      style={{ justifyContent: 'center' }}
    >
      <AnimatedButton
        onClick={() => continueNext()}
        className={styles.continueButton}
      >
        {t('common:continue')}
      </AnimatedButton>
    </div>
  );
};
