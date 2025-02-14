import styles from './DonationReceipt.module.scss';
import SupportAssistanceInfo from './microComponents/SupportAssistanceInfo';

const DonationReceipts = () => {
  return (
    <section className={styles.donationReceiptLayout}>
      <footer className={styles.receiptListFooter}>
        <SupportAssistanceInfo />
      </footer>
    </section>
  );
};

export default DonationReceipts;
