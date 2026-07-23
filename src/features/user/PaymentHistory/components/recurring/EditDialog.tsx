import type { Subscription } from '@/features/common/types/payments';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import getCurrencySymbolByCode from '@/utils/countryCurrency/getCurrencySymbolByCode';

import { useSubscriptionAction } from '../../hooks/useSubscriptionAction';
import { toDateInputValue } from '../../lib/dateInput';

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  record: Subscription;
  fetchRecurrentDonations: (next?: boolean) => void;
}

const FIELD_CLASSES =
  'flex h-10 w-full rounded-md border border-solid border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

export const EditDialog = ({
  open,
  onClose,
  record,
  fetchRecurrentDonations,
}: EditDialogProps) => {
  const t = useTranslations('Me');
  const locale = useLocale();
  const { isSubmitting, run } = useSubscriptionAction({
    fetchRecurrentDonations,
    onClose,
  });

  const isPaypal = record.method === 'paypal';
  const currentPeriodEndDate = toDateInputValue(record.currentPeriodEnd);
  const symbol =
    getCurrencySymbolByCode(locale, record.currency, record.amount) ??
    record.currency;

  const [amount, setAmount] = useState(String(record.amount));
  const [frequency, setFrequency] = useState(record.frequency);
  const [date, setDate] = useState(currentPeriodEndDate);

  const submit = () => {
    // PUT only the changed fields (a diff), matching the legacy modal; if
    // nothing changed, just close without a request.
    const payload: Record<string, unknown> = {};
    const amountNum = Number(amount);
    if (!Number.isNaN(amountNum) && amountNum !== record.amount) {
      payload.centAmount = Math.round(amountNum * 100);
    }
    if (frequency.toLowerCase() !== record.frequency) {
      payload.frequency = frequency;
    }
    if (!isPaypal && date && date !== currentPeriodEndDate) {
      payload.nextBilling = date;
    }
    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }
    run(record.id, 'modify', payload);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('editDonationConfirmation')}</DialogTitle>
          <DialogDescription>{t('editDonationDescription')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-amount" className="text-sm text-foreground">
              {t('donationAmount')}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {symbol}
              </span>
              <Input
                id="edit-amount"
                inputMode="decimal"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value.replace(/[^0-9.]/g, ''))
                }
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-frequency" className="text-sm text-foreground">
              {t('frequency')}
            </label>
            <select
              id="edit-frequency"
              value={frequency}
              onChange={(event) => setFrequency(event.target.value)}
              className={FIELD_CLASSES}
            >
              <option value="monthly">{t('monthly')}</option>
              <option value="yearly">{t('yearly')}</option>
            </select>
          </div>

          {!isPaypal ? (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-date" className="text-sm text-foreground">
                {t('date')}
              </label>
              <Input
                id="edit-date"
                type="date"
                min={currentPeriodEndDate}
                max={
                  record.endsAt ? toDateInputValue(record.endsAt) : '2100-01-01'
                }
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">{t('noteToWait')}</p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={submit} disabled={isSubmitting || !amount}>
            {isSubmitting ? t('editingDonation') : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
