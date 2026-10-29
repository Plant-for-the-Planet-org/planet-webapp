import type { SetupFormHandle, SetupFormProps } from './stripeFields';

import { forwardRef, useId, useImperativeHandle, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IbanElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Info } from 'lucide-react';

import { Input } from '@/components/ui/input';

import { getSepaCreditor } from '../../lib/savedPaymentMethod';
import { Field, STRIPE_ELEMENT_STYLE, StripeFieldFrame } from './stripeFields';

const IBAN_ELEMENT_OPTIONS = {
  supportedCountries: ['SEPA'],
  style: STRIPE_ELEMENT_STYLE,
};

interface SepaSetupFormProps extends SetupFormProps {
  /** The country the method is saved for, which decides the creditor named in the mandate. */
  country: string;
}

/**
 * IBAN, account holder and the SEPA mandate, confirmed against a SetupIntent.
 * Adapted from the fundraisers donate form. A saved account is for later collections, so the mandate always says recurrent.
 */
export const SepaSetupForm = forwardRef<SetupFormHandle, SepaSetupFormProps>(
  function SepaSetupForm({ defaultName, email, onEscape, country }, ref) {
    const t = useTranslations('Payments.addMethod.sepa');
    const stripe = useStripe();
    const elements = useElements();
    const nameId = useId();
    const creditor = getSepaCreditor(country);

    const [ibanComplete, setIbanComplete] = useState(false);
    const [ibanError, setIbanError] = useState<string | null>(null);
    const [name, setName] = useState(defaultName);
    const [nameError, setNameError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      async confirm(clientSecret) {
        let hasError = false;
        if (!ibanComplete) {
          if (!ibanError) setIbanError(t('ibanRequired'));
          hasError = true;
        }
        if (!name.trim()) {
          setNameError(t('nameRequired'));
          hasError = true;
        }
        if (hasError) return { validationFailed: true as const };

        const iban = elements?.getElement(IbanElement);
        if (!stripe || !iban) return { error: t('notReady') };

        const { setupIntent, error } = await stripe.confirmSepaDebitSetup(
          clientSecret,
          {
            payment_method: {
              sepa_debit: iban,
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
        <Field label={t('iban')} error={ibanError}>
          <StripeFieldFrame>
            <IbanElement
              options={IBAN_ELEMENT_OPTIONS}
              onEscape={onEscape}
              onChange={(event) => {
                setIbanComplete(event.complete);
                setIbanError(event.error?.message ?? null);
              }}
            />
          </StripeFieldFrame>
        </Field>

        <Field label={t('name')} htmlFor={nameId} error={nameError}>
          <Input
            id={nameId}
            value={name}
            autoComplete="name"
            placeholder={t('namePlaceholder')}
            onChange={(event) => {
              setName(event.target.value);
              if (nameError) setNameError(null);
            }}
          />
        </Field>

        <div className="flex flex-col gap-3 rounded-md border border-solid border-border p-4 text-sm text-foreground">
          <p className="flex items-center gap-2 font-medium">
            <Info
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
            {t('mandateTitle')}
          </p>
          <p>{t('mandateIntro', { creditor: creditor.name })}</p>
          <dl className="grid grid-cols-2 gap-3">
            <div>
              <dt className="font-medium">{t('creditor')}</dt>
              <dd>{creditor.name}</dd>
            </div>
            <div>
              <dt className="font-medium">{t('creditorId')}</dt>
              <dd>{creditor.id}</dd>
            </div>
            <div>
              <dt className="font-medium">{t('paymentType')}</dt>
              <dd>{t('paymentTypeRecurrent')}</dd>
            </div>
          </dl>
          <p className="text-muted-foreground">{t('mandateRights')}</p>
        </div>
      </div>
    );
  }
);
