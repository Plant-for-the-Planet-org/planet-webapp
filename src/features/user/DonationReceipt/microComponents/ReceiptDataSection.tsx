import type {
  Donation,
  Donor,
} from '../../../common/Layout/DonationReceiptContext';

import styles from '../donationReceipt.module.scss';
import DonationData from './DonationData';
import ReceiptActions from './ReceiptActions';
import RecipientDetails from './RecipientDetails';

interface Prop {
  donations: Donation[];
  donor: Donor;
  downloadUrl: string | null;
}

const ReceiptDataSection = ({ donations, donor, downloadUrl }: Prop) => {
  return (
    <section className={styles.receiptDataSection}>
      <DonationData donations={donations} />
      <RecipientDetails donar={donor} />
      <ReceiptActions downloadUrl={downloadUrl} />
    </section>
  );
};

export default ReceiptDataSection;
