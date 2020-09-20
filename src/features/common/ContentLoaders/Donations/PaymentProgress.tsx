import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import getTranslation from '../../../../../public/locales/getTranslations';
import styles from './PaymentProgress.module.scss';

export default function PaymentProgress(isPaymentProcessing: any) {
  const t = getTranslation();
  return (
    <Backdrop className={styles.progressBackdrop} open={isPaymentProcessing}>
      <CircularProgress color="inherit" />
      <h2 className={styles.progressBackdropHeader}>{t.seedingYourDonation}</h2>
      <h4 className={styles.progressBackdropText}>
        {t.pleaseDoNotCloseThisTab}
      </h4>
    </Backdrop>
  );
}
