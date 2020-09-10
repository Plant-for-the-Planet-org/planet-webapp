import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './PaymentProgress.module.scss';
export default function PaymentProgress(isPaymentProcessing: any) {
    return (
        <Backdrop className={styles.progressBackdrop} open={isPaymentProcessing}>
            <CircularProgress color="inherit" />
            <h2 className={styles.progressBackdropHeader}>Seeding your donation</h2>
            <h4 className={styles.progressBackdropText}>Please do not close this window</h4>
        </Backdrop>
    );
}
