import type { SavedPaymentMethod } from '../../types';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2, TriangleAlert } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  capitalize,
  getExpiryInfo,
  isSepaMethod,
} from '../../lib/savedPaymentMethod';
import { CardBrandIcon } from './CardBrandIcon';
import { SepaIcon } from './SepaIcon';

interface SavedPaymentMethodRowProps {
  method: SavedPaymentMethod;
  isRemoving: boolean;
  /** Resolves true once the method is gone. */
  onRemove: () => Promise<boolean>;
}

/**
 * One saved card or SEPA account: its mark, last four digits, expiry and state, with remove behind a confirm step.
 * The display follows the fundraisers donate form. Expired cards stay listed here, unlike there, so the donor can remove them.
 */
export const SavedPaymentMethodRow = ({
  method,
  isRemoving,
  onRemove,
}: SavedPaymentMethodRowProps) => {
  const t = useTranslations('Payments');
  const tMe = useTranslations('Me');
  // local state
  const [isConfirming, setIsConfirming] = useState(false);

  const isSepa = isSepaMethod(method);
  const last4 = method.last4 ?? '••••';
  const expiry = isSepa
    ? { date: null, isExpired: false, isExpiringSoon: false }
    : getExpiryInfo(method.expires);
  const typeLabel = isSepa
    ? t('methodLabel.sepa')
    : method.brand
    ? capitalize(method.brand)
    : t('methodLabel.card');
  const ariaLabel = isSepa
    ? t('methodLabel.sepaAria', { last4 })
    : t('methodLabel.cardAria', { brand: typeLabel, last4 });

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5">
      <div className="flex h-5 w-8 shrink-0 items-center justify-center">
        {isSepa ? <SepaIcon /> : <CardBrandIcon brand={method.brand} />}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex flex-wrap items-center gap-2 text-foreground">
          <span aria-label={ariaLabel} className="tabular-nums">
            {typeLabel} •••• {last4}
          </span>
          {method.isDefault && (
            <Badge variant="secondary">{t('default')}</Badge>
          )}
          {expiry.isExpired && (
            <Badge className="border-transparent bg-red-100 text-red-800 hover:bg-red-100">
              {t('expired')}
            </Badge>
          )}
          {expiry.isExpiringSoon && (
            <Badge className="gap-1 border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100">
              <TriangleAlert className="size-3" aria-hidden />
              {t('expiringSoon')}
            </Badge>
          )}
        </span>
        {expiry.date && (
          <span
            className={cn(
              'text-xs tabular-nums',
              expiry.isExpired ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {t('expires', { date: expiry.date })}
          </span>
        )}
      </div>

      {isConfirming ? (
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {t('confirmRemoveMethod')}
          </span>
          <Button
            size="sm"
            variant="destructive"
            disabled={isRemoving}
            onClick={() =>
              onRemove().then((removed) => {
                if (removed) setIsConfirming(false);
              })
            }
          >
            {t('remove')}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={isRemoving}
            onClick={() => setIsConfirming(false)}
          >
            {tMe('cancel')}
          </Button>
        </div>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          aria-label={`${t('remove')}: ${ariaLabel}`}
          onClick={() => setIsConfirming(true)}
        >
          <Trash2 className="size-4" />
        </Button>
      )}
    </li>
  );
};
