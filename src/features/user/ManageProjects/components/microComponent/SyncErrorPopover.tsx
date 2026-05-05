import type { SetState } from '../../../../common/types/common';

import { Popover, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import styles from '../../StepForm.module.scss';

interface SyncErrorPopoverProps {
  label: string;
  syncErrors: string[];
  anchor: HTMLButtonElement | null;
  setAnchor: SetState<HTMLButtonElement | null>;
}

const SyncErrorPopover = ({ label, syncErrors, anchor, setAnchor }: SyncErrorPopoverProps) => (
  <div
    className={styles.formFieldLarge}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
  >
    <p className={styles.errorMessage} style={{ margin: 0, width: 'auto' }}>
      {label}
    </p>
    <IconButton
      size="small"
      onClick={(e) => setAnchor(e.currentTarget)}
      style={{ color: 'var(--ds-fire-red, #EB5757)', padding: 2 }}
      aria-label="Show sync errors"
    >
      <InfoOutlinedIcon fontSize="small" />
    </IconButton>
    <Popover
      open={Boolean(anchor)}
      anchorEl={anchor}
      onClose={() => setAnchor(null)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <ul style={{ margin: 0, padding: '12px 16px 12px 28px', maxWidth: 380, fontSize: 13, lineHeight: 1.5 }}>
        {syncErrors.map((err, i) => (
          <li key={i} style={{ marginBottom: i < syncErrors.length - 1 ? 6 : 0 }}>
            {err}
          </li>
        ))}
      </ul>
    </Popover>
  </div>
);

export default SyncErrorPopover;
