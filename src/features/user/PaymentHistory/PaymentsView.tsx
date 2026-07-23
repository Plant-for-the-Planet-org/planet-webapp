import type { PaymentListItem, PaymentStatus } from './types';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2, ReceiptText } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useUserProps } from '@/features/common/Layout/UserPropsContext';
import getFormattedCurrency from '@/utils/countryCurrency/getFormattedCurrency';
import useLocalizedPath from '@/hooks/useLocalizedPath';

import { formatPaymentDate } from './lib/formatPaymentDate';

import { usePayments } from './hooks/usePayments';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { MembershipCta } from './components/MembershipCta';
import { PaymentDetailContent } from './components/PaymentDetailContent';
import { PaymentDetailSheet } from './components/PaymentDetailSheet';
import { PaymentsEmpty } from './components/PaymentsEmpty';
import { PaymentsList } from './components/PaymentsList';
import { PaymentsListSkeleton } from './components/PaymentsListSkeleton';

type FilterKey = 'all' | 'completed' | 'pending' | 'failed' | 'planetCash';

// Status chips are mutually exclusive; PlanetCash is a payment-method quick
// filter (method=planet-cash) that lives in the same single-select row.
const FILTERS: { key: FilterKey; status?: string; method?: string }[] = [
  { key: 'all' },
  { key: 'completed', status: 'paid,complete' },
  { key: 'pending', status: 'pending' },
  { key: 'failed', status: 'failed' },
  { key: 'planetCash', method: 'planet-cash' },
];

/**
 * Donor Payments view (outgoing). On `lg`+ screens it's a master-detail split
 * (list left, detail pane right); below that the list is full-width and a row
 * opens the detail Sheet.
 */
export default function PaymentsView() {
  const t = useTranslations('Me');
  const tPayments = useTranslations('Payments');
  const locale = useLocale();
  const { user } = useUserProps();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

  const [filter, setFilter] = useState<FilterKey>('all');
  const [selectedGuid, setSelectedGuid] = useState<string | null>(null);

  // Deep link: /profile/payments?txn={guid} opens that payment's detail.
  useEffect(() => {
    const txn = router.query.txn;
    if (typeof txn === 'string') {
      setSelectedGuid((current) => (current === txn ? current : txn));
    }
  }, [router.query.txn]);

  // Pre-apply a filter from the URL — e.g. /profile/payments?filter=planetCash,
  // the entry point from the PlanetCash "Transactions" tab.
  useEffect(() => {
    const f = router.query.filter;
    if (typeof f === 'string' && FILTERS.some((x) => x.key === f)) {
      setFilter(f as FilterKey);
    }
  }, [router.query.filter]);

  // Build the clean shareable `as` path (locale-prefixed, not the internal
  // /sites/{slug}/{locale}/... route pattern) carrying the active filter + open
  // txn.
  const buildAsPath = (nextFilter: FilterKey, txn: string | null) => {
    const params = new URLSearchParams();
    if (nextFilter !== 'all') params.set('filter', nextFilter);
    if (txn) params.set('txn', txn);
    const qs = params.toString();
    const base = localizedPath('/profile/payments');
    return qs ? `${base}?${qs}` : base;
  };

  // Reflect selection/filter in the URL. Shallow routing keeps the list mounted
  // (no refetch); usePayments refetches on mount only.
  const selectPayment = (guid: string | null) => {
    setSelectedGuid(guid);
    const query = { ...router.query };
    if (guid) query.txn = guid;
    else delete query.txn;
    router.replace(
      { pathname: router.pathname, query },
      buildAsPath(filter, guid),
      { shallow: true }
    );
  };

  const selectFilter = (key: FilterKey) => {
    setFilter(key);
    // Clear any open selection — the selected txn may not be in the newly
    // filtered list, which would otherwise leave a stale detail pane/Sheet.
    setSelectedGuid(null);
    const query = { ...router.query };
    if (key === 'all') delete query.filter;
    else query.filter = key;
    delete query.txn;
    router.replace(
      { pathname: router.pathname, query },
      buildAsPath(key, null),
      { shallow: true }
    );
  };

  const activeFilter = FILTERS.find((f) => f.key === filter);
  const status = activeFilter?.status;
  const method = activeFilter?.method;
  const params = useMemo(
    () => ({ status, method, limit: 50 }),
    [status, method]
  );

  // Chip labels via literal keys (all/completed/pending/failed + the PlanetCash
  // method label live in Me), so next-intl's typed messages hold.
  const filterLabels: Record<FilterKey, string> = {
    all: t('all'),
    completed: t('completed'),
    pending: t('pending'),
    failed: t('failed'),
    planetCash: t('planet-cash'),
  };

  const {
    payments,
    total,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    reload,
  } = usePayments(params);

  const sentinelRef = useInfiniteScroll(
    loadMore,
    hasMore && !isLoadingMore && !isLoading
  );

  // Membership CTA is hidden for existing Donor Circle members. NOTE: recurring
  // donations are not a reliable signal (they don't persist), so we intentionally
  // do NOT check subscriptions here — a proper flag will come from the profile
  // endpoint later; gate on that once available.
  const showMembershipCta = !user?.isMember;

  const formatAmount = (amount: number, currency: string) =>
    getFormattedCurrency(locale, currency, amount);

  // Empty string (not "—") so the list can omit the date entirely for pending.
  const formatDateLabel = (iso: string | null) => formatPaymentDate(iso, locale);

  const getStatusLabel = (paymentStatus: PaymentStatus | null) => {
    if (!paymentStatus) return '—';
    // Literal keys (a dynamic t(status) breaks typed messages, and a missing
    // key returns "Me.<key>" rather than throwing); unmapped statuses show raw.
    const labels: Record<string, string> = {
      paid: t('paid'),
      complete: t('completed'),
      pending: t('pending'),
      failed: t('failed'),
      refunded: t('refunded'),
    };
    return labels[paymentStatus] ?? paymentStatus;
  };

  // Always "Donation"; dedication ("Dedicated to …") surfaces via the trailing
  // marker in the list and the detail view.
  const getTypeLabel = (_item: PaymentListItem) => t('donation');

  const listContent = isLoading ? (
    <PaymentsListSkeleton />
  ) : error ? (
    <PaymentsEmpty
      title={tPayments('loadError')}
      actionLabel={tPayments('retry')}
      onAction={reload}
    />
  ) : payments.length === 0 ? (
    <PaymentsEmpty title={t('noRecords')} />
  ) : (
    <>
      <PaymentsList
        payments={payments}
        onSelect={selectPayment}
        formatAmount={formatAmount}
        formatDate={formatDateLabel}
        getStatusLabel={getStatusLabel}
        getTypeLabel={getTypeLabel}
        dedicatedLabel={tPayments('dedicated')}
        selectedGuid={selectedGuid}
        compact={isDesktop}
      />
      <div ref={sentinelRef} aria-hidden />
      {isLoadingMore && (
        <div className="flex justify-center py-4 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
        </div>
      )}
    </>
  );

  return (
    // Cap the transactions view width; the master-detail keeps the list column
    // tight (a wide 1fr list leaves empty space in each row) and lets the detail
    // pane absorb the extra width instead. The page container stays flexible.
    <div className="flex max-w-[1060px] flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => selectFilter(f.key)}
            aria-pressed={filter === f.key}
            className={cn(
              'rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors',
              filter === f.key
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-background text-foreground hover:border-foreground/50'
            )}
          >
            {filterLabels[f.key]}
          </button>
        ))}
        <span className="ml-auto text-sm text-muted-foreground">
          {!isLoading && total > 0 ? `${total} ${t('payments')}` : ''}
        </span>
      </div>

      {isDesktop ? (
        <div className="grid grid-cols-[minmax(0,460px)_minmax(0,1fr)] items-start gap-4">
          <div>{listContent}</div>
          <aside className="sticky top-24 flex max-h-[calc(100vh-8rem)] flex-col gap-4 overflow-y-auto">
            {selectedGuid ? (
              <div className="rounded-xl border border-border bg-card p-5">
                <PaymentDetailContent guid={selectedGuid} />
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-border bg-card p-8">
                  <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                    <ReceiptText className="size-8" aria-hidden />
                    <p className="text-sm">{tPayments('selectPayment')}</p>
                  </div>
                </div>
                {showMembershipCta && <MembershipCta />}
              </>
            )}
          </aside>
        </div>
      ) : (
        <>
          {listContent}
          <PaymentDetailSheet
            guid={selectedGuid}
            onClose={() => selectPayment(null)}
          />
        </>
      )}
    </div>
  );
}
