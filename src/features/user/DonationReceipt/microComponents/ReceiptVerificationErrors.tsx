import type { ReactNode } from 'react';

import styles from '../DonationReceipt.module.scss';
import VerifyReceiptFooter from './VerifyReceiptFooter';

const ReceiptVerificationErrors = ({ message }: { message: ReactNode }) => (
  <div className={styles.donationReceiptLayout}>
    <div className={styles.donationReceiptContainer}>
      <p className={styles.baseErrorMessage}>{message}</p>
      <VerifyReceiptFooter />
    </div>
  </div>
);

export default ReceiptVerificationErrors;
