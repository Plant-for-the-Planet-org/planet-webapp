import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import useLocalizedPath from '@/hooks/useLocalizedPath';

/**
 * Section tabs for the Payments hub, rendered once in the shared layout
 * (getPaymentsLayout). Styled like shadcn's TabsList/TabsTrigger but built from
 * real <Link>s so each section is its own route (per-section, shareable URLs).
 * Top tabs — not a left side-menu — so the desktop master-detail split keeps the
 * full content width. The active section is derived from the URL; the
 * single-transaction route (/profile/payments/txn/[id]) keeps "Transactions"
 * active as its parent.
 */
export const PaymentsTabsNav = () => {
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
      className="inline-flex h-10 w-fit max-w-full items-center justify-center overflow-x-auto rounded-md bg-muted p-1 text-muted-foreground"
    >
      {items.map((item) => {
        const active = isActive(item.path, item.isIndex);
        return (
          <Link
            key={item.path}
            href={localizedPath(item.path)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
