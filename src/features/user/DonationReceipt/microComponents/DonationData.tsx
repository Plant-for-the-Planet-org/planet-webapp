import { useTranslations } from 'next-intl';
import styles from '../donationReceipt.module.scss';

type Donations = {
  reference: string;
  amount: string;
  paymentDate: string;
};

type Props = {
  donations: Donations[];
};

const DonationData = ({ donations }: Props) => {
  const t = useTranslations('Donate.donationReceipt');
  return (
    <div className={styles.donationData}>
      <div className={styles.donationRecord}>
        <div className={styles.header}>
          <span>{t('referenceNumber')}</span>
          <span className={styles.amountDonated}>{t('amountDonated')}</span>
          <span className={styles.paymentDate}>{t('paymentDate')}</span>
        </div>
        <ul>
          {donations.map((dtn) => {
            return (
              <li className={styles.record} key={dtn.reference}>
                <span className={styles.reference}>{dtn.reference}</span>
                <span className={styles.amount}>{dtn.amount}</span>
                <time className={styles.date} dateTime={dtn.paymentDate}>
                  {dtn.paymentDate}
                </time>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DonationData;
