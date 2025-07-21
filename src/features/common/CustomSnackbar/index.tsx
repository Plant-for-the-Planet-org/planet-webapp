import type { ReactElement } from 'react';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackbarProps {
  snackbarText: string;
  isVisible: boolean;
  /** Include operations that need to take place when the snackbar is closed */
  handleClose: () => void;
}

/**
 * Component that renders a temporary snackbar to indicate a success message
 */
export default function CustomSnackbar({
  snackbarText,
  isVisible,
  handleClose,
}: SnackbarProps): ReactElement | null {
  return (
    <>
      <Snackbar
        open={isVisible}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <div>
          <Alert
            elevation={6}
            variant="filled"
            onClose={handleClose}
            severity="success"
          >
            {snackbarText}
          </Alert>
        </div>
      </Snackbar>
    </>
  );
}
