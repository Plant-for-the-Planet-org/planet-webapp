import type { ReactNode } from 'react';
import type { Subscription } from '@/features/common/types/payments';

import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import getFormattedCurrency from '@/utils/countryCurrency/getFormattedCurrency';

import { formatPaymentDate } from '../../lib/formatPaymentDate';

export type RecurringAction = 'edit' | 'pause' | 'cancel' | 'reactivate';

interface RecurringRecordProps {
  record: Subscription;
  onAction: (action: RecurringAction) => void;
  /** When true the header toggles the details; when false the card stays open. */
  collapsible?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}

const STATUS_BADGE: Record<string, string> = {
  paused:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  past_due:
    'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  canceled: 'bg-muted text-muted-foreground',
  incomplete_expired: 'bg-muted text-muted-foreground',
  incomplete: 'bg-muted text-muted-foreground',
  unpaid: 'bg-muted text-muted-foreground',
};
// Active/success uses the webapp brand green (--primary #007A49), not a generic
// Tailwind green.
const STATUS_BADGE_ACTIVE = 'bg-primary/10 text-primary';

const Detail = ({
  label,
  value,
  wide,
}: {
  label: string;
  value: ReactNode;
  wide?: boolean;
}) =>
  value === null || value === undefined || value === '' ? null : (
    <div
      className={cn(
        'flex flex-col gap-0.5',
        wide && 'col-span-2 sm:col-span-3'
      )}
    >
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );

export const RecurringRecord = ({
  record,
  onAction,
  collapsible = false,
  expanded = false,
  onToggle,
}: RecurringRecordProps) => {
  const t = useTranslations('Me');
  const locale = useLocale();

  const money = (amount: number) =>
    getFormattedCurrency(locale, record.currency, amount);
  const fmt = (date: string | Date | null | undefined) =>
    formatPaymentDate(date, locale);

  const status = record.status;
  const dest = record.destination;
  const singleName = dest && dest.type !== 'mixed' ? dest.name : undefined;
  const isOpen = !collapsible || expanded;

  const frequencyLabel =
    record.frequency === 'yearly' ? t('yearly') : t('monthly');

  const statusLabel = () => {
    switch (status) {
      case 'active':
      case 'trialing':
        return t('active');
      case 'paused':
        return t('paused');
      case 'canceled':
        return t('canceled');
      case 'past_due':
        return t('past_due');
      case 'incomplete':
        return t('incomplete');
      case 'incomplete_expired':
        return t('incomplete_expired');
      case 'unpaid':
        return t('unpaid');
      default:
        return status;
    }
  };

  const methodLabel = () => {
    switch (record.method) {
      case 'offline':
        return t('offline');
      case 'card':
        return t('card');
      case 'sepa_debit':
        return t('sepa_debit');
      case 'planet-cash':
        return t('planet-cash');
      default:
        return record.method;
    }
  };

  const recordName =
    dest?.type === 'planet-cash'
      ? t('planetCashPayment')
      : dest?.type === 'mixed'
      ? t('donation')
      : singleName ?? '';

  const endsAtFuture = record.endsAt
    ? new Date(record.endsAt) > new Date()
    : false;

  const dateLine = (() => {
    if (status === 'active' || status === 'trialing') {
      return endsAtFuture
        ? `${t('willBeCancelledOn')} ${fmt(record.endsAt)} • ${frequencyLabel}`
        : `${t('nextOn')} ${fmt(record.currentPeriodEnd)} • ${frequencyLabel}`;
    }
    if (status === 'paused') {
      if (endsAtFuture)
        return `${t('willBeCancelledOn')} ${fmt(record.endsAt)} • ${frequencyLabel}`;
      return record.pauseUntil
        ? `${t('pausedUntil')} ${fmt(record.pauseUntil)} • ${frequencyLabel}`
        : t('pausedUntilResumed');
    }
    if (status === 'past_due') {
      return `${t('lastDueOn')} ${fmt(record.currentPeriodEnd)} • ${frequencyLabel}`;
    }
    if (status === 'canceled' && record.endsAt) {
      return `${t('cancelledOn')} ${fmt(record.endsAt)} • ${frequencyLabel}`;
    }
    return '';
  })();

  // Action visibility — verbatim from the legacy ManageDonation component.
  const showPause =
    (status === 'active' || status === 'trialing') &&
    !record.endsAt &&
    record.paymentGateway !== 'offline';
  const showEdit =
    (status === 'active' || status === 'trialing' || status === 'past_due') &&
    record.endsAt === null;
  const showCancel =
    (status === 'active' || status === 'trialing' || status === 'past_due') &&
    !record.endsAt;
  const showReactivate =
    status === 'paused' || new Date(record.endsAt || '') > new Date();
  const showActions =
    status !== 'incomplete' &&
    (showEdit || showReactivate || showPause || showCancel);

  const header = (
    <div className="flex w-full items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-2">
        {collapsible && (
          <ChevronDown
            className={cn(
              'mt-1 size-4 shrink-0 text-muted-foreground transition-transform',
              isOpen && 'rotate-180'
            )}
            aria-hidden
          />
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium text-foreground">{recordName}</p>
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                STATUS_BADGE[status] ?? STATUS_BADGE_ACTIVE
              )}
            >
              {statusLabel()}
            </span>
          </div>
          {dateLine && (
            <p className="mt-0.5 text-sm text-muted-foreground">{dateLine}</p>
          )}
        </div>
      </div>
      <span className="shrink-0 text-lg font-medium tabular-nums text-foreground">
        {money(record.amount)}
      </span>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-solid border-border bg-card">
      {collapsible ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex w-full px-5 py-4 text-left transition-colors hover:bg-accent/30"
        >
          {header}
        </button>
      ) : (
        <div className="px-5 py-4">{header}</div>
      )}

      {isOpen && (
        <div className="border-t border-solid border-border px-5 py-4">
          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <Detail label={t('amount')} value={money(record.amount)} />
            <Detail label={t('frequency')} value={frequencyLabel} />
            <Detail label={t('paymentMethod')} value={methodLabel()} />
            <Detail
              label={t('totalDonated')}
              value={
                Number.isNaN(record.totalDonated)
                  ? null
                  : money(record.totalDonated)
              }
            />
            <Detail
              label={t('firstDonation')}
              value={fmt(record.firstDonation?.created)}
            />
            {dest?.type === 'mixed' ? (
              <Detail
                wide
                label={t('projects')}
                value={
                  <ul className="space-y-0.5">
                    {dest.items.map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </ul>
                }
              />
            ) : dest?.type === 'planet-cash' ? (
              <Detail label={t('planet-cash')} value={t('planetCashPayment')} />
            ) : (
              <Detail label={t('project')} value={singleName} />
            )}
            <Detail
              label={t('reference')}
              value={record.firstDonation?.reference}
            />
          </dl>

          {showActions && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-solid border-border pt-4">
              {showEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAction('edit')}
                >
                  {t('editDonation')}
                </Button>
              )}
              {showReactivate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAction('reactivate')}
                >
                  {status === 'paused'
                    ? t('resumeDonation')
                    : t('reactivateDonation')}
                </Button>
              )}
              {showPause && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAction('pause')}
                >
                  {t('pauseDonation')}
                </Button>
              )}
              {showCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onAction('cancel')}
                >
                  {t('cancelDonation')}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
