import { useTranslations } from 'next-intl';
import styles from '../donationReceipt.module.scss';

type Props = {
  verificationDate: number | null;
};

const ReceiptVerificationHeader = ({ verificationDate }: Props) => {
  const t = useTranslations('Donate.donationReceipt');
  return (
    <section className={styles.receiptVerificationHeader}>
      {verificationDate === null ? (
        <>
          <h2>{t('verifyTaxHeaderPrimary')}</h2>
          <h3>{t('verifyTaxHeaderSecondary')}</h3>
        </>
      ) : (
        <h2>{t('downloadTaxReceipt')}</h2>
      )}
    </section>
  );
};

export default ReceiptVerificationHeader;
