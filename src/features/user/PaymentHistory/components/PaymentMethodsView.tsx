import type { SavedPaymentMethod } from '../types';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CreditCard, Landmark, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserProps } from '@/features/common/Layout/UserPropsContext';

import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { PaymentsEmpty } from './PaymentsEmpty';
import { PaymentsListSkeleton } from './PaymentsListSkeleton';

const isSepa = (method: SavedPaymentMethod) =>
  method.type === 'sepa_debit' || method.brand === 'sepa';

const methodLabel = (method: SavedPaymentMethod) => {
  const last4 = method.last4 ?? '••••';
  if (isSepa(method)) return `SEPA ···· ${last4}`;
  const brand = method.brand
    ? method.brand.charAt(0).toUpperCase() + method.brand.slice(1)
    : 'Card';
  return `${brand} ···· ${last4}`;
};

/**
 * Lists the profile's saved payment methods (card / SEPA) with the ability to
 * remove them. Adding a method is deferred — it requires Stripe Elements, which
 * the webapp does not yet integrate.
 */
export const PaymentMethodsView = () => {
  const t = useTranslations('Me');
  const { user } = useUserProps();

  const country =
    user?.country ??
    (typeof window !== 'undefined'
      ? localStorage.getItem('countryCode')
      : null) ??
    'DE';

  const { methods, isLoading, removingId, removeMethod } =
    usePaymentMethods(country);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  if (isLoading) return <PaymentsListSkeleton rows={3} />;
  if (methods.length === 0)
    return <PaymentsEmpty title={t('noPaymentMethods')} />;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <ul className="divide-y divide-border">
        {methods.map((method) => {
          const Icon = isSepa(method) ? Landmark : CreditCard;
          return (
            <li key={method.id} className="flex items-center gap-4 px-4 py-3.5">
              <Icon
                className="size-5 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex items-center gap-2 text-foreground">
                  {methodLabel(method)}
                  {method.isDefault && (
                    <Badge variant="secondary">{t('default')}</Badge>
                  )}
                </span>
                {method.expires && (
                  <span className="text-xs text-muted-foreground">
                    {method.expires}
                  </span>
                )}
              </div>

              {confirmingId === method.id ? (
                <div className="flex items-center gap-2">
                  <span className="hidden text-sm text-muted-foreground sm:inline">
                    {t('confirmRemoveMethod')}
                  </span>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={removingId === method.id}
                    onClick={() =>
                      removeMethod(method.id).then(() => setConfirmingId(null))
                    }
                  >
                    {t('remove')}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmingId(null)}
                  >
                    {t('cancel')}
                  </Button>
                </div>
              ) : (
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={t('remove')}
                  onClick={() => setConfirmingId(method.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
