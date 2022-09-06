import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { ReactElement } from 'react';
import { styled } from '@mui/material/styles';

interface SnackBarProps {
  snackBarText: String;
  isVisible: boolean;
  handleClose: () => void;
}

const Alert = styled(MuiAlert)(({ theme }) => {
  return {
    backgroundColor: theme.palette.primary.main,
  };
});

export default function CustomizedSnackbars({
  snackBarText,
  isVisible,
  handleClose,
}: SnackBarProps): ReactElement | null {
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
            {snackBarText}
          </Alert>
        </div>
      </Snackbar>
    </>
  );
}
