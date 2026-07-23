import type { Subscription } from '@/features/common/types/payments';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useSubscriptionAction } from '../../hooks/useSubscriptionAction';
import { toDateInputValue } from '../../lib/dateInput';
import { DateField } from './DateField';
import { DialogActions } from './DialogActions';

interface CancelDialogProps {
  open: boolean;
  onClose: () => void;
  record: Subscription;
  fetchRecurrentDonations: (next?: boolean) => void;
}

type CancelOption = 'cancelImmediately' | 'cancelOnSelectedDate';

export const CancelDialog = ({
  open,
  onClose,
  record,
  fetchRecurrentDonations,
}: CancelDialogProps) => {
  const t = useTranslations('Me');
  const { isSubmitting, run } = useSubscriptionAction({
    fetchRecurrentDonations,
    onClose,
  });

  const isPaypal = record.method === 'paypal';
  const minDate = toDateInputValue(new Date().toISOString(), 1);
  const [option, setOption] = useState<CancelOption>('cancelImmediately');
  const [date, setDate] = useState(minDate);

  const submit = () => {
    // PayPal can only cancel immediately (no date options are shown).
    const isCustom = !isPaypal && option === 'cancelOnSelectedDate';
    run(record.id, 'cancel', {
      cancellationType: isCustom ? 'custom-date' : 'immediate',
      cancellationDate: isCustom ? date : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('cancelDonationConfirmation')}</DialogTitle>
          <DialogDescription>
            {isPaypal
              ? t('cancelDonationPaypalDescription')
              : t('cancelDonationDescription')}
          </DialogDescription>
        </DialogHeader>

        {!isPaypal && (
          <div className="flex flex-col gap-3">
            {(['cancelImmediately', 'cancelOnSelectedDate'] as const).map(
              (value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                >
                  <input
                    type="radio"
                    name="cancelOption"
                    value={value}
                    checked={option === value}
                    onChange={() => setOption(value)}
                    className="size-4 accent-primary"
                  />
                  {t(value)}
                </label>
              )
            )}

            {option === 'cancelOnSelectedDate' && (
              <DateField min={minDate} value={date} onChange={setDate} />
            )}
          </div>
        )}

        <DialogActions
          onClose={onClose}
          onSave={submit}
          saveLabel={isSubmitting ? t('cancellingDonation') : t('save')}
          disabled={isSubmitting}
          destructive
        />
      </DialogContent>
    </Dialog>
  );
};
