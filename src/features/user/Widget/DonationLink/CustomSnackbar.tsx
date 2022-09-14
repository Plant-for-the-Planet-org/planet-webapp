import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { ReactElement } from 'react';
import { styled } from '@mui/material/styles';

interface SnackbarProps {
  snackbarText: String;
  isVisible: boolean;
  handleClose: () => void;
}

const Alert = styled(MuiAlert)(({ theme }) => {
  return {
    backgroundColor: theme.palette.primary.main,
  };
});

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
