import type { DonationView } from '../donationReceipt';

import { useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';

type Props = {
  donations: DonationView[] | null;
};

const DonationsTable = ({ donations }: Props) => {
  const tReceipt = useTranslations('DonationReceipt');
  return (
    <div className={styles.donationsTable}>
      <div className={styles.header} role="row">
        <span role="columnheader">
          {tReceipt('donationDetails.referenceNumber')}
        </span>
        <span className={styles.amountDonated} role="columnheader">
          {tReceipt('donationDetails.amountDonated')}
        </span>
        <span className={styles.paymentDate} role="columnheader">
          {tReceipt('donationDetails.paymentDate')}
        </span>
      </div>
      <ul role="table">
        {donations?.map((dtn) => {
          return (
            <li className={styles.record} key={dtn.reference} role="row">
              <span className={styles.reference} role="cell">
                {dtn.reference}
              </span>
              <span className={styles.amount} role="cell">
                {tReceipt('donationDetails.donationAmount', {
                  currency: dtn.currency,
                  amount: dtn.amount,
                })}
              </span>
              <time
                className={styles.date}
                dateTime={dtn.paymentDate}
                role="cell"
              >
                {formatDate(dtn.paymentDate)}
              </time>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DonationsTable;
