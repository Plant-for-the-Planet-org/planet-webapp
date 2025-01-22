import styles from '../donationReceipt.module.scss';
import { donationData } from '../utils';
import DonationData from './DonationData';
import ReceiptActions from './ReceiptActions';
import RecipientDetails from './RecipientDetails';

const ReceiptDataSection = () => {
  return (
    <section className={styles.receiptDataSection}>
      <DonationData donations={donationData.donations} />
      <RecipientDetails donar={donationData.donor} />
      <ReceiptActions />
    </section>
  );
};

export default ReceiptDataSection;
