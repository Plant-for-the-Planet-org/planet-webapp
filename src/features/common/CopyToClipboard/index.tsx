import React, { ReactElement } from 'react'
import CopyIcon from '../../../../public/assets/images/icons/CopyIcon'
import styles from './styles.module.scss'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }));
  

interface Props {
    text: any;
}

export default function CopyToClipboard({text}: Props): ReactElement {
    const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = async () => {
    try {
        await navigator.clipboard.writeText(text);
        setOpen(true);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    
      }

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
    return (
        <>
        <div onClick={handleClick} className={styles.copyButtonContainer}>
        <CopyIcon/> 
        </div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
            Copied to clipboard!
        </Alert>
      </Snackbar>
        </>
    )
}
