import type { PaymentListItem, PaymentStatus } from './types';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2, ReceiptText } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useUserProps } from '@/features/common/Layout/UserPropsContext';
import getFormattedCurrency from '@/utils/countryCurrency/getFormattedCurrency';
import formatDate from '@/utils/countryCurrency/getFormattedDate';
import useLocalizedPath from '@/hooks/useLocalizedPath';

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

  // Select a payment and reflect it in the URL so the link is shareable. Pass a
  // clean `as` path so the address bar shows /{locale}/profile/payments — not the
  // internal /sites/{slug}/{locale}/... route pattern — while shallow routing
  // keeps the list mounted (no refetch).
  const selectPayment = (guid: string | null) => {
    setSelectedGuid(guid);
    const query = { ...router.query };
    if (guid) query.txn = guid;
    else delete query.txn;
    const asPath = guid
      ? `${localizedPath('/profile/payments')}?txn=${encodeURIComponent(guid)}`
      : localizedPath('/profile/payments');
    router.replace({ pathname: router.pathname, query }, asPath, {
      shallow: true,
    });
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
  const formatDateLabel = (iso: string | null) => (iso ? formatDate(iso) : '');

  const getStatusLabel = (paymentStatus: PaymentStatus | null) => {
    if (!paymentStatus) return '—';
    try {
      return t(paymentStatus);
    } catch {
      return paymentStatus;
    }
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
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
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,380px)] items-start gap-4">
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
