import type { PaymentStatus } from '../types';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusTone = 'success' | 'warning' | 'destructive' | 'neutral';

/**
 * Map a raw backend status onto a visual tone. Grouped rather than 1:1 so new
 * or unexpected statuses degrade to a neutral badge instead of breaking.
 */
export const getStatusTone = (status: PaymentStatus | null): StatusTone => {
  switch ((status ?? '').toLowerCase()) {
    case 'paid':
    case 'complete':
    case 'completed':
    case 'success':
      return 'success';
    case 'pending':
    case 'in-progress':
    case 'processing':
      return 'warning';
    case 'failed':
    case 'refunded':
      return 'destructive';
    default:
      return 'neutral';
  }
};

const TONE_CLASSES: Record<StatusTone, string> = {
  success:
    'border-transparent bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/40 dark:text-green-300',
  warning:
    'border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300',
  destructive:
    'border-transparent bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300',
  neutral: 'border-transparent bg-muted text-muted-foreground hover:bg-muted',
};

interface PaymentStatusBadgeProps {
  status: PaymentStatus | null;
  /** Localized label; falls back to the raw status when omitted. */
  label?: string;
  className?: string;
}

export const PaymentStatusBadge = ({
  status,
  label,
  className,
}: PaymentStatusBadgeProps) => {
  const tone = getStatusTone(status);
  return (
    <Badge className={cn('font-medium', TONE_CLASSES[tone], className)}>
      {label ?? status ?? '—'}
    </Badge>
  );
};
