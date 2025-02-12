import type { Donations } from '../donationReceiptTypes';

import { useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';

type Props = {
  donations: Donations[];
  amount: number | null;
  currency: string | null;
};

const DonationsTable = ({ donations, amount, currency }: Props) => {
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
        {donations?.map(({ reference, currency, amount, paymentDate }) => {
          return (
            <li className={styles.record} key={reference} role="row">
              <span className={styles.reference} role="cell">
                {reference}
              </span>
              <span className={styles.amount} role="cell">
                {tReceipt('donationDetails.donationAmount', {
                  currency,
                  amount,
                })}
              </span>
              <time className={styles.date} dateTime={paymentDate} role="cell">
                {formatDate(paymentDate)}
              </time>
            </li>
          );
        })}
      </ul>
      {amount !== null && (
        <div className={styles.totalAmount}>
          {tReceipt('donationDetails.donationAmount', {
            currency,
            amount,
          })}
        </div>
      )}
    </div>
  );
};

export default DonationsTable;
