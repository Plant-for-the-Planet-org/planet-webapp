import { useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';

const ReceiptValidationError = () => {
  const tReceipt = useTranslations('DonationReceipt');
  return (
    <section className={styles.ReceiptValidationError}>
      <p className={styles.invalidReceiptErrorMessage}>
        {tReceipt.rich('InvalidReceiptMessage', {
          b: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>
    </section>
  );
};

export default ReceiptValidationError;
