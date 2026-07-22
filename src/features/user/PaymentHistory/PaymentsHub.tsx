import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import PaymentsView from './PaymentsView';
import { PaymentMethodsView } from './components/PaymentMethodsView';
import { RecurringTab } from './components/RecurringTab';

type Section = 'transactions' | 'recurring' | 'methods';

/**
 * The Payments hub: one place that combines the donor's transactions, recurring
 * donations, and saved payment methods under section tabs. Rendered inside
 * DashboardView by the /profile/payments page.
 */
export default function PaymentsHub() {
  const t = useTranslations('Me');
  const [section, setSection] = useState<Section>('transactions');

  return (
    <Tabs
      value={section}
      onValueChange={(value) => setSection(value as Section)}
      className="flex flex-col gap-4"
    >
      <TabsList className="w-fit">
        <TabsTrigger value="transactions">{t('transactions')}</TabsTrigger>
        <TabsTrigger value="recurring">{t('recurring')}</TabsTrigger>
        <TabsTrigger value="methods">{t('paymentMethods')}</TabsTrigger>
      </TabsList>

      <TabsContent value="transactions" className="mt-0">
        <PaymentsView />
      </TabsContent>

      <TabsContent value="recurring" className="mt-0">
        <RecurringTab />
      </TabsContent>

      <TabsContent value="methods" className="mt-0">
        <PaymentMethodsView />
      </TabsContent>
    </Tabs>
  );
}
