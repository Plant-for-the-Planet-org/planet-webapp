import type { Subscription } from '@/features/common/types/payments';
import type { RecurringAction } from './RecurringRecord';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Skeleton } from '@/components/ui/skeleton';

import { PaymentsEmpty } from '../PaymentsEmpty';
import { RecurringRecord } from './RecurringRecord';
import { EditDialog } from './EditDialog';
import { PauseDialog } from './PauseDialog';
import { CancelDialog } from './CancelDialog';
import { ReactivateDialog } from './ReactivateDialog';

interface RecurringViewProps {
  isDataLoading: boolean;
  recurrencies?: Subscription[];
  fetchRecurrentDonations: (next?: boolean) => void;
}

/**
 * shadcn rebuild of the recurring-donations view (replaces the MUI
 * Account/Recurrency). Renders a card per subscription and drives the
 * Edit/Pause/Cancel/Reactivate modals; each is a PUT /app/subscriptions/{id}
 * with a scope (see useSubscriptionAction).
 */
export const RecurringView = ({
  isDataLoading,
  recurrencies,
  fetchRecurrentDonations,
}: RecurringViewProps) => {
  const t = useTranslations('Me');
  const [activeModal, setActiveModal] = useState<RecurringAction | null>(null);
  const [currentRecord, setCurrentRecord] = useState<Subscription | null>(null);

  const openModal = (action: RecurringAction, record: Subscription) => {
    setCurrentRecord(record);
    setActiveModal(action);
  };
  const closeModal = () => setActiveModal(null);

  if (!recurrencies && isDataLoading) {
    return (
      <div className="flex max-w-2xl flex-col gap-4">
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    );
  }

  if (recurrencies && recurrencies.length === 0) {
    return <PaymentsEmpty title={t('noRecords')} />;
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {recurrencies?.map((record) => (
        <RecurringRecord
          key={record.id}
          record={record}
          onAction={(action) => openModal(action, record)}
        />
      ))}

      {currentRecord && (
        <>
          {activeModal === 'edit' && (
            <EditDialog
              open
              onClose={closeModal}
              record={currentRecord}
              fetchRecurrentDonations={fetchRecurrentDonations}
            />
          )}
          {activeModal === 'pause' && (
            <PauseDialog
              open
              onClose={closeModal}
              record={currentRecord}
              fetchRecurrentDonations={fetchRecurrentDonations}
            />
          )}
          {activeModal === 'cancel' && (
            <CancelDialog
              open
              onClose={closeModal}
              record={currentRecord}
              fetchRecurrentDonations={fetchRecurrentDonations}
            />
          )}
          {activeModal === 'reactivate' && (
            <ReactivateDialog
              open
              onClose={closeModal}
              record={currentRecord}
              fetchRecurrentDonations={fetchRecurrentDonations}
            />
          )}
        </>
      )}
    </div>
  );
};
