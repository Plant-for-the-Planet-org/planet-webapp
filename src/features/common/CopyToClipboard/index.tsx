import type { ReactElement, SyntheticEvent } from 'react';

import { useState } from 'react';
import CopyIcon from '../../../../public/assets/images/icons/CopyIcon';
import styles from './styles.module.scss';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTranslations } from 'next-intl';

interface Props {
  text: string;
  isButton?: boolean;
  customCopyButton?: ReactElement;
}

export default function CopyToClipboard({
  text,
  isButton,
  customCopyButton,
}: Props): ReactElement {
  const t = useTranslations('Common');
  const [open, setOpen] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setOpen(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
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
        {customCopyButton ? customCopyButton : <CopyIcon />}
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
