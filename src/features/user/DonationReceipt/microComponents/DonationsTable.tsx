import type { Donation } from '../donationReceiptTypes';

import { useLocale, useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';

type Props = {
  donations: Donation[];
  amount: number | null;
  currency: string | null;
};

const DonationsTable = ({ donations, amount, currency }: Props) => {
  const tReceipt = useTranslations('DonationReceipt');
  const locale = useLocale();
  return (
    <table
      className={styles.donationsTable}
      aria-label={tReceipt('donationDetails.title')}
    >
      <thead>
        <tr className={styles.header}>
          <th scope="col" className={styles.reference}>
            {tReceipt('donationDetails.referenceNumber')}
          </th>
          <th scope="col" className={styles.amountDonated}>
            {tReceipt('donationDetails.amountDonated')}
          </th>
          <th scope="col" className={styles.paymentDate}>
            {tReceipt('donationDetails.paymentDate')}
          </th>
        </tr>
      </thead>
      <tbody>
        {donations?.map(({ reference, currency, amount, paymentDate }) => {
          return (
            <tr className={styles.record} key={reference}>
              <td className={styles.reference}>{reference}</td>
              <td className={styles.amount}>
                {tReceipt('donationDetails.donationAmount', {
                  currency,
                  amount: amount.toFixed(2),
                })}
              </td>
              <td className={styles.date}>
                <time dateTime={paymentDate}>
                  {formatDate(paymentDate, locale)}
                </time>
              </td>
            </tr>
          );
        })}
      </tbody>
      {amount !== null && currency !== null && (
        <tfoot>
          <tr>
            <td colSpan={3} className={styles.totalAmount}>
              {tReceipt('donationDetails.donationAmount', {
                currency,
                amount,
              })}
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
};

export default DonationsTable;
