import { useTranslations } from 'next-intl';
import styles from '../donationReceipt.module.scss';

type Props = {
  downloadUrl: number | null;
};

const ReceiptVerificationHeader = ({ downloadUrl }: Props) => {
  const t = useTranslations('Donate.donationReceipt');
  return (
    <section className={styles.receiptVerificationHeader}>
      {downloadUrl ? (
        <h2>{t('downloadTaxReceipt')}</h2>
      ) : (
        <>
          <h2>{t('verifyTaxHeaderPrimary')}</h2>
          <h3>{t('verifyTaxHeaderSecondary')}</h3>
        </>
      )}
    </section>
  );
};

export default ReceiptVerificationHeader;
