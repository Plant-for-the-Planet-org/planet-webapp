import { useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';

const ReceiptValidationError = () => {
  const tReceipt = useTranslations('DonationReceipt');
  return (
    <section className={styles.receiptValidationError}>
      <p className={styles.errorMessage}>
        {tReceipt.rich('InvalidReceiptMessage', {
          b: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>
    </section>
  );
};

export default ReceiptValidationError;
