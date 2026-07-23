import { useTranslations } from 'next-intl';

import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DialogActionsProps {
  onClose: () => void;
  onSave: () => void;
  /** Save-button label (callers swap in a loading label while submitting). */
  saveLabel: string;
  disabled?: boolean;
  /** Use the destructive variant for the primary action (e.g. Cancel donation). */
  destructive?: boolean;
}

/**
 * Standard modal footer: a text Close button next to the primary action. Used
 * instead of a corner X (see ui/dialog) so every dialog dismisses the same way.
 */
export const DialogActions = ({
  onClose,
  onSave,
  saveLabel,
  disabled,
  destructive,
}: DialogActionsProps) => {
  const tCommon = useTranslations('Common');

  return (
    <DialogFooter>
      <Button variant="outline" onClick={onClose} disabled={disabled}>
        {tCommon('close')}
      </Button>
      <Button
        variant={destructive ? 'destructive' : 'default'}
        onClick={onSave}
        disabled={disabled}
      >
        {saveLabel}
      </Button>
    </DialogFooter>
  );
};
