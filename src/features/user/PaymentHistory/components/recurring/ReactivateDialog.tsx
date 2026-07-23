import type { Subscription } from '@/features/common/types/payments';

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

import { useSubscriptionAction } from '../../hooks/useSubscriptionAction';
import { formatPaymentDate } from '../../lib/formatPaymentDate';

interface ReactivateDialogProps {
  open: boolean;
  onClose: () => void;
  record: Subscription;
  fetchRecurrentDonations: (next?: boolean) => void;
}

export const ReactivateDialog = ({
  open,
  onClose,
  record,
  fetchRecurrentDonations,
}: ReactivateDialogProps) => {
  const t = useTranslations('Me');
  const locale = useLocale();
  const { isSubmitting, run } = useSubscriptionAction({
    fetchRecurrentDonations,
    onClose,
  });

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('reactivateDonationConfirmation')}</DialogTitle>
          <DialogDescription>
            {t('reactivateDonationDescription', {
              currentPeriodEnds: formatPaymentDate(
                record.currentPeriodEnd,
                locale
              ),
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => run(record.id, 'reactivate', {})}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('reactivatingDonation') : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
