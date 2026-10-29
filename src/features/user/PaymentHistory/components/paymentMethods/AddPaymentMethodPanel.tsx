import type { SetupIntentMethod, SetupIntentResponse } from '../../types';
import type { OpenSetupIntent } from '../../hooks/useSetupIntent';
import type { SetupFormHandle } from './stripeFields';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Elements } from '@stripe/react-stripe-js';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStore } from '@/stores/userStore';

import { useSetupIntent } from '../../hooks/useSetupIntent';
import { getStripe } from '../../lib/getStripe';
import { CardSetupForm } from './CardSetupForm';
import { SepaSetupForm } from './SepaSetupForm';

interface AddPaymentMethodPanelProps {
  onClose: () => void;
  /** Called with the Stripe payment method id once Stripe has saved it. */
  onAdded: (paymentMethodId: string) => void;
}

type LoadState = 'loading' | 'ready' | 'error' | 'unavailable';

/**
 * Saves a card or SEPA account without a payment, through a Stripe SetupIntent.
 * This is inline rather than a dialog on purpose: a modal traps focus and blocks clicks outside it, which would lock the donor out of Stripe's 3-D Secure popup.
 * Leaving without saving cancels the SetupIntent, so open ones do not pile up on the customer.
 */
export const AddPaymentMethodPanel = ({
  onClose,
  onAdded,
}: AddPaymentMethodPanelProps) => {
  const t = useTranslations('Payments.addMethod');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  // store: state
  const userProfile = useUserStore((state) => state.userProfile);

  const { createSetupIntent, cancelSetupIntent } = useSetupIntent();
  const cancelRef = useRef(cancelSetupIntent);
  cancelRef.current = cancelSetupIntent;

  // local state
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [intent, setIntent] = useState<SetupIntentResponse | null>(null);
  const [method, setMethod] = useState<SetupIntentMethod>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const formRef = useRef<SetupFormHandle>(null);
  const openIntentRef = useRef<OpenSetupIntent | null>(null);

  useEffect(() => {
    let active = true;
    setLoadState('loading');
    createSetupIntent()
      .then((res) => {
        if (!active) {
          cancelRef.current(res).catch(() => undefined);
          return;
        }
        openIntentRef.current = res;
        // A platform without the publishable key in this response cannot be confirmed against, so it reads as unavailable.
        const methods = res.methods ?? [];
        setIntent({ ...res, methods });
        setMethod(methods.includes('card') ? 'card' : methods[0]);
        setLoadState(
          res.publishableKey && methods.length > 0 ? 'ready' : 'unavailable'
        );
      })
      .catch(() => {
        if (active) setLoadState('error');
      });
    return () => {
      active = false;
    };
  }, [createSetupIntent, attempt]);

  // Cancel an unconfirmed SetupIntent when the panel goes away.
  useEffect(
    () => () => {
      if (openIntentRef.current) {
        cancelRef.current(openIntentRef.current).catch(() => undefined);
      }
    },
    []
  );

  const stripePromise = useMemo(
    () =>
      intent?.publishableKey ? getStripe(intent.publishableKey, locale) : null,
    [intent?.publishableKey, locale]
  );

  const defaultName = userProfile
    ? `${userProfile.firstname ?? ''} ${userProfile.lastname ?? ''}`.trim() ||
      userProfile.displayName ||
      ''
    : '';

  const handleClose = useCallback(() => {
    if (!isSubmitting) onClose();
  }, [isSubmitting, onClose]);

  const save = async () => {
    if (!intent || !formRef.current) return;
    setIsSubmitting(true);
    setSubmitError(null);
    const result = await formRef.current.confirm(intent.clientSecret);
    setIsSubmitting(false);
    if ('validationFailed' in result) return;
    if ('error' in result) {
      setSubmitError(result.error);
      return;
    }
    // Saved: the SetupIntent is spent and must not be cancelled.
    openIntentRef.current = null;
    onAdded(result.paymentMethodId);
  };

  return (
    <section
      aria-labelledby="add-payment-method-title"
      className="flex flex-col gap-5 rounded-xl border border-solid border-border bg-card p-4 sm:p-6"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="add-payment-method-title"
          className="m-0 text-base font-semibold text-foreground"
        >
          {t('title')}
        </h2>
        <p className="m-0 text-sm text-muted-foreground">{t('description')}</p>
      </div>

      {loadState === 'loading' && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {(loadState === 'error' || loadState === 'unavailable') && (
        <p role="alert" className="m-0 text-sm text-destructive">
          {loadState === 'error' ? t('loadError') : t('unavailable')}
        </p>
      )}

      {loadState === 'ready' && intent && stripePromise && (
        <>
          {intent.methods.length > 1 && (
            <fieldset className="m-0 flex flex-wrap gap-x-6 gap-y-2 border-0 p-0">
              <legend className="sr-only">{t('typeLegend')}</legend>
              {intent.methods.map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                >
                  <input
                    type="radio"
                    name="paymentMethodType"
                    value={value}
                    checked={method === value}
                    disabled={isSubmitting}
                    onChange={() => {
                      setMethod(value);
                      setSubmitError(null);
                    }}
                    className="size-4 accent-primary"
                  />
                  {value === 'card' ? t('typeCard') : t('typeSepa')}
                </label>
              ))}
            </fieldset>
          )}

          <Elements stripe={stripePromise} key={intent.clientSecret}>
            {method === 'card' ? (
              <CardSetupForm
                ref={formRef}
                defaultName={defaultName}
                email={userProfile?.email ?? ''}
                onEscape={handleClose}
              />
            ) : (
              <SepaSetupForm
                ref={formRef}
                defaultName={defaultName}
                email={userProfile?.email ?? ''}
                onEscape={handleClose}
                country={intent.accountCountry}
              />
            )}
          </Elements>

          {submitError && (
            <p role="alert" className="m-0 text-sm text-destructive">
              {submitError}
            </p>
          )}
        </>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="ghost"
          onClick={handleClose}
          disabled={isSubmitting}
          className="text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {tCommon('close')}
        </Button>
        {loadState === 'error' ? (
          <Button
            variant="outline"
            onClick={() => setAttempt((count) => count + 1)}
          >
            {t('retry')}
          </Button>
        ) : (
          <Button
            onClick={save}
            disabled={loadState !== 'ready' || isSubmitting}
          >
            {isSubmitting ? t('saving') : t('save')}
          </Button>
        )}
      </div>
    </section>
  );
};
