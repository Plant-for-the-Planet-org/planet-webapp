import type { PaymentListItem, PaymentStatus } from '../types';

import { ChevronRight, UserRound } from 'lucide-react';

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
  /** Highlights the active row (desktop master-detail). */
  selectedGuid?: string | null;
  /**
   * Compact rows for the narrow list column in the desktop master-detail split:
   * date moves into the subline, and the date column + chevron are dropped.
   */
  compact?: boolean;
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
      <UserRound
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
  selectedGuid,
  compact = false,
}: PaymentsListProps) => (
  <div className="overflow-hidden rounded-xl border border-border bg-card">
    <ul className="divide-y divide-border">
      {payments.map((item) => {
        // Fall back to the creation date for failed/pending rows (no paymentDate).
        const date = formatDate(item.paymentDate ?? item.created ?? null);
        return (
          <li key={item.guid}>
            <button
              type="button"
              onClick={() => onSelect(item.guid)}
              aria-current={item.guid === selectedGuid}
              className={cn(
                'flex w-full items-center gap-4 px-4 py-3.5 text-left',
                'transition-colors hover:bg-accent/40',
                item.guid === selectedGuid && 'bg-accent/60'
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <PaymentTypeLabel
                  label={getTypeLabel(item)}
                  isDedicated={item.isGift}
                  dedicatedLabel={dedicatedLabel}
                />
                {date && (
                  <span
                    className={cn(
                      'truncate text-xs text-muted-foreground',
                      !compact && 'sm:hidden'
                    )}
                  >
                    {date}
                  </span>
                )}
              </div>
              {!compact && (
                <span className="hidden w-32 shrink-0 whitespace-nowrap text-sm text-muted-foreground sm:block">
                  {date}
                </span>
              )}
              <span className="w-24 shrink-0 text-right tabular-nums text-foreground">
                {formatAmount(item.amount, item.currency)}
              </span>
              <PaymentStatusBadge
                status={item.status}
                label={getStatusLabel(item.status)}
                variant="dot-only"
                className="shrink-0"
              />
              {!compact && (
                <ChevronRight
                  className="hidden size-4 shrink-0 text-muted-foreground sm:block"
                  aria-hidden
                />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  </div>
);
