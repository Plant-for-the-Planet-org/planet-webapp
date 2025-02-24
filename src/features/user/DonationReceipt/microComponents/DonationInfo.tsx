import { useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';

type Props = {
  currency: string;
  amount: number;
  count: number;
  reference: string;
  date: string;
};

const DonationInfo = ({ currency, amount, count, reference, date }: Props) => {
  const tReceipt = useTranslations('DonationReceipt');
  return (
    <div className={styles.donationInfo}>
      <span className={styles.amount}>
        {tReceipt('donationDetails.donationAmount', {
          currency,
          amount,
        })}
      </span>
      <span>
        {tReceipt('donationInfo', {
          count,
          reference,
          date,
        })}
      </span>
    </div>
  );
};

export default DonationInfo;
