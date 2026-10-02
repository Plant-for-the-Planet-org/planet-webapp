import { Inbox } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PaymentsEmptyProps {
  title: string;
  description?: string;
  /** When provided, renders a retry action (used for the error state). */
  actionLabel?: string;
  onAction?: () => void;
}

/** Shared empty / error placeholder for the payments list. */
export const PaymentsEmpty = ({
  title,
  description,
  actionLabel,
  onAction,
}: PaymentsEmptyProps) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <Inbox className="size-10 text-muted-foreground" aria-hidden />
    <div className="flex flex-col gap-1">
      <p className="text-foreground">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {actionLabel && onAction && (
      <Button variant="outline" size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);
