import { useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';
import VerifyReceiptFooter from './VerifyReceiptFooter';

const EditPermissionDenied = () => {
  const tReceipt = useTranslations('DonationReceipt');
  return (
    <section className={styles.donorContactManagementLayout}>
      <div className={styles.donorContactManagement}>
        <p className={styles.baseErrorMessage}>
          {tReceipt.rich('errors.editPermissionDeniedMessage', {
            b: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <VerifyReceiptFooter />
      </div>
    </section>
  );
};

export default EditPermissionDenied;
