import type { PaymentListItem, PaymentStatus } from '../types';

import { ChevronRight, Heart } from 'lucide-react';

import { cn } from '@/lib/utils';

import { PaymentStatusBadge } from './PaymentStatusBadge';

interface PaymentsListProps {
  payments: PaymentListItem[];
  onSelect: (guid: string) => void;
  formatAmount: (amount: number, currency: string) => string;
  /** Returns '' when there is no date (e.g. pending payments). */
  formatDate: (iso: string | null) => string;
  getStatusLabel: (status: PaymentStatus | null) => string;
  /** Row label — always "Donation" now; dedication is shown via a trailing icon. */
  getTypeLabel: (item: PaymentListItem) => string;
  /** Accessible label for the trailing dedication marker (e.g. "Dedicated"). */
  dedicatedLabel: string;
}

/**
 * "Donation" label with a trailing dedication marker. No leading icon: rows read
 * "Donation", and dedicated donations get a small heart AFTER the word.
 */
const PaymentTypeLabel = ({
  label,
  isDedicated,
  dedicatedLabel,
}: {
  label: string;
  isDedicated?: boolean;
  dedicatedLabel: string;
}) => (
  <span className="flex items-center gap-1.5 truncate text-foreground">
    {label}
    {isDedicated && (
      <Heart
        className="size-3.5 shrink-0 text-primary"
        aria-label={dedicatedLabel}
      />
    )}
  </span>
);

/**
 * Presentational payments list. A single responsive row layout (no separate
 * desktop/mobile markup): each row reflows naturally from phone to wide desktop.
 * Formatters and labels are injected to keep this decoupled from app wiring.
 */
export const PaymentsList = ({
  payments,
  onSelect,
  formatAmount,
  formatDate,
  getStatusLabel,
  getTypeLabel,
  dedicatedLabel,
}: PaymentsListProps) => (
  <ul className="flex flex-col divide-y divide-border">
    {payments.map((item) => {
      const date = formatDate(item.paymentDate);
      return (
        <li key={item.guid}>
          <button
            type="button"
            onClick={() => onSelect(item.guid)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left',
              'transition-colors hover:bg-accent/40'
            )}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <PaymentTypeLabel
                label={getTypeLabel(item)}
                isDedicated={item.isGift}
                dedicatedLabel={dedicatedLabel}
              />
              <span className="truncate text-xs text-muted-foreground">
                {item.reference}
                {date && ` · ${date}`}
              </span>
            </div>
            <span className="shrink-0 tabular-nums text-foreground">
              {formatAmount(item.amount, item.currency)}
            </span>
            <PaymentStatusBadge
              status={item.status}
              label={getStatusLabel(item.status)}
              className="shrink-0"
            />
            <ChevronRight
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
          </button>
        </li>
      );
    })}
  </ul>
);
