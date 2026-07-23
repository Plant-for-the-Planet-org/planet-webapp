import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import UserLayout from '@/features/common/Layout/UserLayout/UserLayout';
import { useTenantStore } from '@/stores/tenantStore';

import { PaymentsPageShell } from './PaymentsPageShell';
import { PaymentsSideNav } from './components/PaymentsSideNav';

/** A page that supplies its own layout via getLayout (Pages Router pattern). */
export type NextPageWithPaymentsLayout<P = Record<string, unknown>> =
  NextPage<P> & {
    getLayout?: (page: ReactElement) => ReactNode;
  };

const PaymentsLayout = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('Me');
  const isInitialized = useTenantStore((state) => state.isInitialized);

  // Match every other profile page: render nothing until the tenant store is
  // ready. This runs once; the layout then persists across section navigations.
  if (!isInitialized) return <></>;

  return (
    <UserLayout>
      <PaymentsPageShell title={t('payments')} subtitle={t('donationsSubTitle')}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[160px_minmax(0,1fr)] md:gap-0">
          <PaymentsSideNav />
          <div className="min-w-0 md:border-l md:border-solid md:border-border md:pl-6">
            {children}
          </div>
        </div>
      </PaymentsPageShell>
    </UserLayout>
  );
};

/**
 * Shared layout for every Payments hub route (transactions, recurring, payment
 * methods, single transaction). Assigning the SAME function to each page's
 * `getLayout` lets React keep UserLayout + the shell + the section tabs mounted
 * across client-side navigation between sections — only the page body swaps.
 */
export const getPaymentsLayout = (page: ReactElement): ReactNode => (
  <PaymentsLayout>{page}</PaymentsLayout>
);
