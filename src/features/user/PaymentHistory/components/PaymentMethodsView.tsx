import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/userStore';

import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { AddPaymentMethodPanel } from './paymentMethods/AddPaymentMethodPanel';
import { SavedPaymentMethodRow } from './paymentMethods/SavedPaymentMethodRow';
import { PaymentsEmpty } from './PaymentsEmpty';
import { PaymentsListSkeleton } from './PaymentsListSkeleton';

type SyncNotice = 'syncing' | 'delayed' | null;

/**
 * Lists the profile's saved payment methods (card / SEPA) for the profile's country, and lets the donor add and remove them.
 */
export const PaymentMethodsView = () => {
  const t = useTranslations('Payments');
  // local state
  const [isAdding, setIsAdding] = useState(false);
  const [syncNotice, setSyncNotice] = useState<SyncNotice>(null);
  // store: state
  const userCountry = useUserStore((state) => state.userProfile?.country);

  const country =
    userCountry ??
    (typeof window !== 'undefined'
      ? localStorage.getItem('countryCode')
      : null) ??
    'DE';

  const { methods, isLoading, removingId, removeMethod, waitForMethod } =
    usePaymentMethods(country);

  const handleAdded = async (paymentMethodId: string) => {
    setIsAdding(false);
    setSyncNotice('syncing');
    const found = await waitForMethod(paymentMethodId);
    setSyncNotice(found ? null : 'delayed');
  };

  const addButton = !isAdding && (
    <Button
      variant="outline"
      size="sm"
      className="self-start"
      onClick={() => {
        setIsAdding(true);
        setSyncNotice(null);
      }}
    >
      <Plus className="mr-1.5 size-4" aria-hidden />
      {t('addMethod.open')}
    </Button>
  );

  if (isLoading) return <PaymentsListSkeleton rows={3} />;

  return (
    <div className="flex flex-col gap-4">
      {methods.length === 0 && !isAdding && syncNotice === null ? (
        <PaymentsEmpty
          title={t('noPaymentMethods')}
          description={t('noPaymentMethodsDescription')}
          actionLabel={t('addMethod.open')}
          onAction={() => setIsAdding(true)}
        />
      ) : (
        <>
          {methods.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-solid border-border bg-card">
              <ul className="m-0 list-none divide-y divide-border p-0">
                {methods.map((method) => (
                  <SavedPaymentMethodRow
                    key={method.id}
                    method={method}
                    isRemoving={removingId === method.id}
                    onRemove={() => removeMethod(method.id)}
                  />
                ))}
              </ul>
            </div>
          )}

          {syncNotice && (
            <p role="status" className="m-0 text-sm text-muted-foreground">
              {syncNotice === 'syncing'
                ? t('addMethod.syncing')
                : t('addMethod.delayed')}
            </p>
          )}

          {addButton}
        </>
      )}

      {isAdding && (
        <AddPaymentMethodPanel
          country={country}
          onClose={() => setIsAdding(false)}
          onAdded={handleAdded}
        />
      )}
    </div>
  );
};
