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

const DOT_CLASSES: Record<StatusTone, string> = {
  success: 'bg-green-600 dark:bg-green-400',
  warning: 'bg-amber-500 dark:bg-amber-400',
  destructive: 'bg-red-600 dark:bg-red-400',
  neutral: 'bg-muted-foreground',
};

interface PaymentStatusBadgeProps {
  status: PaymentStatus | null;
  /** Localized label; falls back to the raw status when omitted. */
  label?: string;
  className?: string;
  /**
   * 'badge' = filled pill (used in the detail).
   * 'dot' = compact colored dot + label.
   * 'dot-only' = just the colored dot (used in the list); the label is kept
   *   available to assistive tech (sr-only) and on hover (title), since the full
   *   status text is shown in the detail view.
   */
  variant?: 'badge' | 'dot' | 'dot-only';
}

export const PaymentStatusBadge = ({
  status,
  label,
  className,
  variant = 'badge',
}: PaymentStatusBadgeProps) => {
  const tone = getStatusTone(status);
  const text = label ?? status ?? '—';

  if (variant === 'dot-only') {
    return (
      <span className={cn('inline-flex', className)} title={text}>
        <span
          className={cn('size-2.5 shrink-0 rounded-full', DOT_CLASSES[tone])}
          aria-hidden
        />
        <span className="sr-only">{text}</span>
      </span>
    );
  }

  if (variant === 'dot') {
    return (
      <span
        className={cn(
          'flex items-center gap-1.5 text-sm text-muted-foreground',
          className
        )}
      >
        <span
          className={cn('size-2 shrink-0 rounded-full', DOT_CLASSES[tone])}
          aria-hidden
        />
        {text}
      </span>
    );
  }

  return (
    <Badge className={cn('font-medium', TONE_CLASSES[tone], className)}>
      {text}
    </Badge>
  );
};
