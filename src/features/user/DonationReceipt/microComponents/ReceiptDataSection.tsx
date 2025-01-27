import {
  useDonationReceipt,
  type ReceiptData,
} from '../../../common/Layout/DonationReceiptContext';

import styles from '../donationReceipt.module.scss';
import DonationData from './DonationData';
import ReceiptActions from './ReceiptActions';
import RecipientDetails from './RecipientDetails';

interface Prop {
  donationReceiptData: ReceiptData | null;
}

const ReceiptDataSection = ({ donationReceiptData }: Prop) => {
  if (!donationReceiptData) return null;
  const { updateDonationReceiptData } = useDonationReceipt();
  const {
    issuedDonations,
    downloadUrl,
    operation,
    donor,
    address,
    hasDonorDataChanged,
    dtn,
    challenge,
    year,
  } = donationReceiptData;
  return (
    <section className={styles.receiptDataSection}>
      <DonationData donations={issuedDonations} />
      <RecipientDetails donor={donor} address={address} />
      <ReceiptActions
        downloadUrl={downloadUrl}
        operation={operation}
        hasDonorDataChanged={hasDonorDataChanged}
        dtn={dtn}
        challenge={challenge}
        year={year}
        updateDonationReceiptData={updateDonationReceiptData}
      />
    </section>
  );
};

export default ReceiptDataSection;
