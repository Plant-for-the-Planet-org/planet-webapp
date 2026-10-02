import { useTranslations } from 'next-intl';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { PaymentDetailContent } from './PaymentDetailContent';

interface PaymentDetailSheetProps {
  guid: string | null;
  onClose: () => void;
}

/**
 * Payment detail as a responsive side sheet (full-width on mobile). Used below
 * the `lg` breakpoint; on larger screens the detail renders in an inline pane
 * (see PaymentsView) instead. Both share PaymentDetailContent.
 */
export const PaymentDetailSheet = ({
  guid,
  onClose,
}: PaymentDetailSheetProps) => {
  const t = useTranslations('Me');
  return (
    <Sheet open={Boolean(guid)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        {/* Visible title lives in PaymentDetailContent; this satisfies a11y. */}
        <SheetHeader className="sr-only">
          <SheetTitle>{t('payments')}</SheetTitle>
        </SheetHeader>
        <PaymentDetailContent guid={guid} />
      </SheetContent>
    </Sheet>
  );
};
