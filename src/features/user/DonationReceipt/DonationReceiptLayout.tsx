import styles from './donationReceipt.module.scss';
import { donationData } from './utils';
import ReceiptDataSection from './microComponents/ReceiptDataSection';
import ReceiptVerificationHeader from './microComponents/ReceiptVerificationHeader';
import ReceiptListRedirect from './microComponents/ReceiptListRedirect';

export const DonationReceiptLayout = () => {
  return (
    <div className={styles.donationReceiptLayout}>
      <div className={styles.donationReceiptContainer}>
        <ReceiptVerificationHeader downloadUrl={donationData.downloadUrl} />
        <ReceiptDataSection />
        <ReceiptListRedirect />
      </div>
    </div>
  );
};

export default DonationReceiptLayout;
