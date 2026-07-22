import type { PaymentListItem, PaymentStatus } from './types';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import getFormattedCurrency from '@/utils/countryCurrency/getFormattedCurrency';
import formatDate from '@/utils/countryCurrency/getFormattedDate';

import { usePayments } from './hooks/usePayments';
import { PaymentDetailSheet } from './components/PaymentDetailSheet';
import { PaymentsEmpty } from './components/PaymentsEmpty';
import { PaymentsList } from './components/PaymentsList';
import { PaymentsListSkeleton } from './components/PaymentsListSkeleton';

type FilterKey = 'all' | 'completed' | 'pending';

const FILTERS: { key: FilterKey; status?: string }[] = [
  { key: 'all' },
  { key: 'completed', status: 'paid,complete' },
  { key: 'pending', status: 'pending' },
];

/**
 * Donor Payments view (outgoing). Redesigned list built on GET /app/payments.
 * Rendered inside DashboardView by the /profile/payments page.
 */
export default function PaymentsView() {
  const t = useTranslations('Me');
  const locale = useLocale();

  const [filter, setFilter] = useState<FilterKey>('all');
  const [selectedGuid, setSelectedGuid] = useState<string | null>(null);

  const status = FILTERS.find((f) => f.key === filter)?.status;
  const params = useMemo(() => ({ status, limit: 50 }), [status]);

  const {
    payments,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    reload,
  } = usePayments(params);

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

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as FilterKey)}
      >
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.key} value={f.key}>
              {t(f.key)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <PaymentsListSkeleton />
      ) : error ? (
        <PaymentsEmpty
          title={t('loadError')}
          actionLabel={t('retry')}
          onAction={reload}
        />
      ) : payments.length === 0 ? (
        <PaymentsEmpty title={t('noRecords')} />
      ) : (
        <>
          <PaymentsList
            payments={payments}
            onSelect={setSelectedGuid}
            formatAmount={formatAmount}
            formatDate={formatDateLabel}
            getStatusLabel={getStatusLabel}
            getTypeLabel={getTypeLabel}
            dedicatedLabel={t('dedicated')}
          />
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={isLoadingMore}
              >
                {t('loadMore')}
              </Button>
            </div>
          )}
        </>
      )}

      <PaymentDetailSheet
        guid={selectedGuid}
        onClose={() => setSelectedGuid(null)}
      />
    </div>
  );
}
