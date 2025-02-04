import type { Operation } from './ReceiptActions';

import { useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';
import { RECEIPT_STATUS } from '../utils';

type Props = {
  operation: Operation;
};

const ReceiptVerificationHeader = ({ operation }: Props) => {
  const t = useTranslations('Donate.donationReceipt');
  return (
    <section className={styles.receiptVerificationHeader}>
      {operation === RECEIPT_STATUS.DOWNLOAD ? (
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
