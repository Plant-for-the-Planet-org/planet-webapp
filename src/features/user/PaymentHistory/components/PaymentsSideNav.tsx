import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import useLocalizedPath from '@/hooks/useLocalizedPath';

/**
 * Left section menu for the Payments hub, rendered once in the shared layout
 * (getPaymentsLayout). A vertical list of real <Link>s on md+ (mirroring the
 * app's TabbedView side menu), collapsing to a horizontal scroll row on mobile.
 * The active section is derived from the URL; the single-transaction route
 * (/profile/payments/txn/[id]) keeps "Transactions" active as its parent.
 */
export const PaymentsSideNav = () => {
  const t = useTranslations('Me');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

  const currentPath = router.asPath.split('?')[0];
  const txnBase = localizedPath('/profile/payments/txn');

  // Labels resolved with literal keys so next-intl's typed messages hold.
  const items = [
    { label: t('transactions'), path: '/profile/payments', isIndex: true },
    {
      label: t('recurring'),
      path: '/profile/payments/recurring',
      isIndex: false,
    },
    {
      label: t('paymentMethods'),
      path: '/profile/payments/methods',
      isIndex: false,
    },
  ];

  // Transactions is the hub index; it also owns the single-transaction sub-route.
  const isActive = (path: string, isIndex: boolean) => {
    const target = localizedPath(path);
    return isIndex
      ? currentPath === target || currentPath.startsWith(txnBase)
      : currentPath === target;
  };

  return (
    <nav
      aria-label={t('payments')}
      className="flex flex-row gap-1 overflow-x-auto md:flex-col md:gap-0.5 md:overflow-visible"
    >
      {items.map((item) => {
        const active = isActive(item.path, item.isIndex);
        return (
          <Link
            key={item.path}
            href={localizedPath(item.path)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors md:pl-0',
              active
                ? 'font-medium text-primary'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            {active && (
              <span
                className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary md:-left-2.5"
                aria-hidden
              />
            )}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
