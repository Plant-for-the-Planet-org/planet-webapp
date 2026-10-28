import type { SetupFormHandle, SetupFormProps } from './stripeFields';

import { forwardRef, useId, useImperativeHandle, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import { Input } from '@/components/ui/input';

import { Field, STRIPE_ELEMENT_STYLE, StripeFieldFrame } from './stripeFields';

const CARD_ELEMENT_OPTIONS = { style: STRIPE_ELEMENT_STYLE };

/**
 * Card number, expiry, CVC and cardholder name, confirmed against a SetupIntent.
 * Adapted from the fundraisers donate form, without the billing address: a card saved for later needs none.
 */
export const CardSetupForm = forwardRef<SetupFormHandle, SetupFormProps>(
  function CardSetupForm({ defaultName, email, onEscape }, ref) {
    const t = useTranslations('Payments.addMethod.card');
    const stripe = useStripe();
    const elements = useElements();
    const nameId = useId();

    const [numberComplete, setNumberComplete] = useState(false);
    const [numberError, setNumberError] = useState<string | null>(null);
    const [expiryComplete, setExpiryComplete] = useState(false);
    const [expiryError, setExpiryError] = useState<string | null>(null);
    const [cvcComplete, setCvcComplete] = useState(false);
    const [cvcError, setCvcError] = useState<string | null>(null);
    const [name, setName] = useState(defaultName);
    const [nameError, setNameError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      async confirm(clientSecret) {
        let hasError = false;
        if (!numberComplete) {
          if (!numberError) setNumberError(t('numberRequired'));
          hasError = true;
        }
        if (!expiryComplete) {
          if (!expiryError) setExpiryError(t('expiryRequired'));
          hasError = true;
        }
        if (!cvcComplete) {
          if (!cvcError) setCvcError(t('cvcRequired'));
          hasError = true;
        }
        if (!name.trim()) {
          setNameError(t('nameRequired'));
          hasError = true;
        }
        if (hasError) return { validationFailed: true as const };

        const card = elements?.getElement(CardNumberElement);
        if (!stripe || !card) return { error: t('notReady') };

        const { setupIntent, error } = await stripe.confirmCardSetup(
          clientSecret,
          {
            payment_method: {
              card,
              billing_details: { name: name.trim(), email },
            },
          }
        );
        if (error) return { error: error.message ?? t('failed') };

        const paymentMethod = setupIntent.payment_method;
        if (!paymentMethod) return { error: t('failed') };
        return {
          paymentMethodId:
            typeof paymentMethod === 'string'
              ? paymentMethod
              : paymentMethod.id,
        };
      },
    }));

    return (
      <div className="flex flex-col gap-4">
        <Field label={t('number')} error={numberError}>
          <StripeFieldFrame>
            <CardNumberElement
              options={CARD_ELEMENT_OPTIONS}
              onEscape={onEscape}
              onChange={(event) => {
                setNumberComplete(event.complete);
                setNumberError(event.error?.message ?? null);
              }}
            />
          </StripeFieldFrame>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t('expiry')} error={expiryError}>
            <StripeFieldFrame>
              <CardExpiryElement
                options={CARD_ELEMENT_OPTIONS}
                onEscape={onEscape}
                onChange={(event) => {
                  setExpiryComplete(event.complete);
                  setExpiryError(event.error?.message ?? null);
                }}
              />
            </StripeFieldFrame>
          </Field>
          <Field label={t('cvc')} error={cvcError}>
            <StripeFieldFrame>
              <CardCvcElement
                options={CARD_ELEMENT_OPTIONS}
                onEscape={onEscape}
                onChange={(event) => {
                  setCvcComplete(event.complete);
                  setCvcError(event.error?.message ?? null);
                }}
              />
            </StripeFieldFrame>
          </Field>
        </div>

        <Field label={t('name')} htmlFor={nameId} error={nameError}>
          <Input
            id={nameId}
            value={name}
            autoComplete="cc-name"
            placeholder={t('namePlaceholder')}
            onChange={(event) => {
              setName(event.target.value);
              if (nameError) setNameError(null);
            }}
          />
        </Field>
      </div>
    );
  }
);
