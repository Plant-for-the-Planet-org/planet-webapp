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
  // `undefined` = untouched (first record open by default); a string/null once
  // the user toggles. Accordion: one card open at a time, collapse-all allowed.
  const [expandedId, setExpandedId] = useState<string | null | undefined>(
    undefined
  );

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

  // Collapse cards only when there's more than one; a single one stays open.
  const collapsible = (recurrencies?.length ?? 0) > 1;
  const firstId = recurrencies?.[0]?.id;
  const currentExpanded = expandedId === undefined ? firstId : expandedId;
  const toggleExpanded = (id: string) =>
    setExpandedId((current) => {
      const effective = current === undefined ? firstId ?? null : current;
      return effective === id ? null : id;
    });

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {recurrencies?.map((record) => (
        <RecurringRecord
          key={record.id}
          record={record}
          onAction={(action) => openModal(action, record)}
          collapsible={collapsible}
          expanded={currentExpanded === record.id}
          onToggle={() => toggleExpanded(record.id)}
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
