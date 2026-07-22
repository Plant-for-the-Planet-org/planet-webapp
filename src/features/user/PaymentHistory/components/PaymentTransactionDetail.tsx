import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import useLocalizedPath from '@/hooks/useLocalizedPath';

import { PaymentDetailContent } from './PaymentDetailContent';

/**
 * Full-page single-transaction detail, rendered at /profile/payments/txn/[id]
 * (a shareable, directly-openable link). Reuses the same PaymentDetailContent
 * body as the desktop master-detail pane and the mobile Sheet; data is fetched
 * client-side from the guid (the auth token isn't available during static
 * generation, so the id is read from the route on the client).
 */
export const PaymentTransactionDetail = () => {
  const t = useTranslations('Me');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

  const id = typeof router.query.id === 'string' ? router.query.id : null;

  return (
    <div className="flex flex-col gap-4">
      <Link
        href={localizedPath('/profile/payments')}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t('transactions')}
      </Link>

      <div className="max-w-2xl rounded-xl border border-border bg-card p-5 sm:p-6">
        {id ? (
          <PaymentDetailContent guid={id} />
        ) : (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
      </div>
    </div>
  );
};
