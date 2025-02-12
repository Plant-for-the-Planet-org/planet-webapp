import type { Operation } from '../donationReceiptTypes';

import { useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';
import { RECEIPT_STATUS } from '../utils';

type Props = {
  operation: Operation;
};

const VerifyReceiptHeader = ({ operation }: Props) => {
  const tReceipt = useTranslations('DonationReceipt');
  return (
    <section className={styles.verifyReceiptHeader}>
      {operation === RECEIPT_STATUS.DOWNLOAD ? (
        <h2>{tReceipt('downloadTaxReceipt')}</h2>
      ) : (
        <>
          <h2>{tReceipt('verifyTaxHeaderPrimary')}</h2>
          <h3>{tReceipt('verifyTaxHeaderSecondary')}</h3>
        </>
      )}
    </section>
  );
};

export default VerifyReceiptHeader;
