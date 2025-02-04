import type { IssuedDonationView } from '../donationReceipt';

import { useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';

type Props = {
  donations: IssuedDonationView[] | null;
};

const DonationData = ({ donations }: Props) => {
  const tReceipt = useTranslations('DonationReceipt');
  return (
    <div className={styles.donationData}>
      <div className={styles.donationRecord}>
        <div className={styles.header}>
          <span>{tReceipt('donationDetails.referenceNumber')}</span>
          <span className={styles.amountDonated}>
            {tReceipt('donationDetails.amountDonated')}
          </span>
          <span className={styles.paymentDate}>
            {tReceipt('donationDetails.paymentDate')}
          </span>
        </div>
        <ul>
          {donations?.map((dtn) => {
            return (
              <li className={styles.record} key={dtn.reference}>
                <span className={styles.reference}>{dtn.reference}</span>
                <span className={styles.amount}>
                  {tReceipt('donationDetails.donationAmount', {
                    currency: dtn.currency,
                    amount: dtn.amount,
                  })}
                </span>
                <time className={styles.date} dateTime={dtn.paymentDate}>
                  {formatDate(dtn.paymentDate)}
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
