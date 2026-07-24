import type { ReactElement, SyntheticEvent } from 'react';

import { useState } from 'react';
import CopyIcon from '../../../../public/assets/images/icons/CopyIcon';
import styles from './styles.module.scss';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';

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
  const containerClassName = clsx(styles.copyButtonContainer, {
    [styles.button]: isButton,
  });

  return (
    <>
      {customCopyButton ? (
        // `customCopyButton` already renders its own semantic <button>, so the
        // wrapper stays a non-interactive <span>. onClick is kept only as a
        // bubbling target for the child button's clicks (keyboard included);
        // making the wrapper a <button> would nest interactive controls.
        <span onClick={handleClick} className={containerClassName}>
          {customCopyButton}
        </span>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className={containerClassName}
        >
          <CopyIcon />
        </button>
      )}
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
