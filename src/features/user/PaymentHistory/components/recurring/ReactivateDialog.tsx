import type { Subscription } from '@/features/common/types/payments';

import { useLocale, useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useSubscriptionAction } from '../../hooks/useSubscriptionAction';
import { formatPaymentDate } from '../../lib/formatPaymentDate';
import { DialogActions } from './DialogActions';

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
        <DialogActions
          onClose={onClose}
          onSave={() => run(record.id, 'reactivate', {})}
          saveLabel={isSubmitting ? t('reactivatingDonation') : t('save')}
          disabled={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
