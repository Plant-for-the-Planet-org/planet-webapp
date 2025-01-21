import styles from './donationReceipt.module.scss';
import { donationData } from './utils';
import ReceiptDataSection from './microComponents/ReceiptDataSection';
import ReceiptVerificationHeader from './microComponents/ReceiptVerificationHeader';
import ReceiptFooterSection from './microComponents/ReceiptFooterSection';

export const DonationReceiptLayout = () => {
  return (
    <div className={styles.donationReceiptLayout}>
      <div className={styles.donationReceiptContainer}>
        <ReceiptVerificationHeader
          verificationDate={donationData.verificationDate}
        />
        <ReceiptDataSection />
        <ReceiptFooterSection />
      </div>
    </div>
  );
};

export default DonationReceiptLayout;
