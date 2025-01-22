import styles from '../donationReceipt.module.scss';
import { donationData } from '../utils';
import DonationData from './DonationData';

const ReceiptDataSection = () => {
  return (
    <section className={styles.receiptDataSection}>
      <DonationData donations={donationData.donations} />
      <div className={styles.recipientDetails}></div>
      <div className={styles.receiptActions}></div>
    </section>
  );
};

export default ReceiptDataSection;
