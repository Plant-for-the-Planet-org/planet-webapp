import React, { ReactElement } from 'react';
import CopyIcon from '../../../../public/assets/images/icons/CopyIcon';
import styles from './styles.module.scss';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const Alert = styled(MuiAlert)(({ theme }) => {
  return {
    backgroundColor: theme.palette.primary.main,
  };
});

interface Props {
  text: any;
  isButton: any;
}

export default function CopyToClipboard({
  text,
  isButton,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(['common']);
  const [open, setOpen] = React.useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setOpen(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <>
      <div
        onClick={handleClick}
        className={`${styles.copyButtonContainer} ${
          isButton ? styles.button : ''
        }`}
      >
        <CopyIcon />
      </div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
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
            {t('copiedToClipboard')}
          </Alert>
        </div>
      </Snackbar>
    </>
  );
}
