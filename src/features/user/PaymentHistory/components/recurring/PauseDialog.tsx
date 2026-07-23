import type { Subscription } from '@/features/common/types/payments';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

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

import { useSubscriptionAction } from '../../hooks/useSubscriptionAction';
import { toDateInputValue } from '../../lib/dateInput';

interface PauseDialogProps {
  open: boolean;
  onClose: () => void;
  record: Subscription;
  fetchRecurrentDonations: (next?: boolean) => void;
}

type PauseOption = 'pauseUntilResume' | 'pauseUntilDate';

export const PauseDialog = ({
  open,
  onClose,
  record,
  fetchRecurrentDonations,
}: PauseDialogProps) => {
  const t = useTranslations('Me');
  const { isSubmitting, run } = useSubscriptionAction({
    fetchRecurrentDonations,
    onClose,
  });

  const minDate = toDateInputValue(record.currentPeriodEnd, 1);
  const [option, setOption] = useState<PauseOption>('pauseUntilResume');
  const [date, setDate] = useState(minDate);

  const submit = () => {
    const isCustom = option === 'pauseUntilDate';
    run(record.id, 'pause', {
      pauseType: isCustom ? 'custom-date' : 'infinite',
      pauseUntil: isCustom ? date : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('pauseDonationConfirmation')}</DialogTitle>
          <DialogDescription>{t('pauseDonationDescription')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {(['pauseUntilResume', 'pauseUntilDate'] as const).map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
            >
              <input
                type="radio"
                name="pauseOption"
                value={value}
                checked={option === value}
                onChange={() => setOption(value)}
                className="size-4 accent-primary"
              />
              {t(value)}
            </label>
          ))}

          {option === 'pauseUntilDate' && (
            <div className="flex flex-col gap-1.5">
              <Input
                type="date"
                min={minDate}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">{t('pauseNote')}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={submit} disabled={isSubmitting}>
            {isSubmitting ? t('pausingDonation') : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
