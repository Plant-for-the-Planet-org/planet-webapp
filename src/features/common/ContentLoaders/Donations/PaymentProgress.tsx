import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import i18next from '../../../../../i18n';
import styles from './PaymentProgress.module.scss';

const { useTranslation } = i18next;

export default function PaymentProgress(isPaymentProcessing: any) {
  const { t, ready } = useTranslation(['donate']);

  return ready ? (
    <Backdrop className={styles.progressBackdrop} open={isPaymentProcessing}>
      <CircularProgress color="inherit" />
      <h2 className={styles.progressBackdropHeader}>
        {t('donate:seedingYourDonation')}
      </h2>
      <h4 className={styles.progressBackdropText}>
        {t('donate:pleaseDoNotCloseThisTab')}
      </h4>
    </Backdrop>
  ) : null;
}
