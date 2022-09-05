import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import i18next from '../../../../../i18n';
import { ReactElement, useState } from 'react';
import styled from '@emotion/styled';

interface SnackBarProps {
  SnackBartext: String;
  isVisible: boolean;
  handleClose: () => void;
}
const { useTranslation } = i18next;

const Alert = styled(MuiAlert)(({ theme }) => {
  return {
    backgroundColor: theme.palette.primary.main,
  };
});

export default function CustomizedSnackbars({
  SnackBartext,
  isVisible,
  handleClose,
}: SnackBarProps): ReactElement | null {
  const { t } = useTranslation(['donationLink']);
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
            {t(`donationLink:${SnackBartext}`)}
          </Alert>
        </div>
      </Snackbar>
    </>
  );
}
