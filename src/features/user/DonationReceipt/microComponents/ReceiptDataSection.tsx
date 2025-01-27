import type { ReceiptData } from '../../../common/Layout/DonationReceiptContext';

import styles from '../donationReceipt.module.scss';
import DonationData from './DonationData';
import ReceiptActions from './ReceiptActions';
import RecipientDetails from './RecipientDetails';

interface Prop {
  donationReceiptData: ReceiptData | null;
}

const ReceiptDataSection = ({ donationReceiptData }: Prop) => {
  if (!donationReceiptData) return null;
  const { issuedDonations, downloadUrl, operation, donor, address } =
    donationReceiptData;
  return (
    <section className={styles.receiptDataSection}>
      <DonationData donations={issuedDonations} />
      <RecipientDetails donor={donor} address={address} />
      <ReceiptActions downloadUrl={downloadUrl} operation={operation} />
    </section>
  );
};

export default ReceiptDataSection;
