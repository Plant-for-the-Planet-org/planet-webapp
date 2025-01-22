import styles from '../donationReceipt.module.scss';
import { donationData } from '../utils';
import DonationData from './DonationData';
import RecipientDetails from './RecipientDetails';

const ReceiptDataSection = () => {
  return (
    <section className={styles.receiptDataSection}>
      <DonationData donations={donationData.donations} />
      <RecipientDetails donar={donationData.donor} />
      <div className={styles.receiptActions}></div>
    </section>
  );
};

export default ReceiptDataSection;
