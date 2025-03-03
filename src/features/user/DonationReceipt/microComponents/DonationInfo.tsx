import type {
  IssuedDonationApi,
  UnissuedDonationApi,
} from '../donationReceiptTypes';

import { useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';
import { useCallback, useState } from 'react';
import DonationInfoPopover from './DonationInfoPopover';

type Props = {
  currency: string;
  amount: number;
  count: number;
  reference: string;
  date: string;
  donations: UnissuedDonationApi[] | IssuedDonationApi[];
};

const DonationInfo = ({
  currency,
  amount,
  count,
  reference,
  date,
  donations,
}: Props) => {
  const tReceipt = useTranslations('DonationReceipt');
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
    null
  );
  const openPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setPopoverAnchor(event.currentTarget);
    },
    []
  );
  const closePopover = useCallback(() => {
    setPopoverAnchor(null);
  }, []);

  return (
    <div className={styles.donationInfo}>
      <span className={styles.amount}>
        {tReceipt('donationDetails.donationAmount', {
          currency,
          amount: Number(amount).toFixed(2),
        })}
      </span>
      {count === 1 &&
        tReceipt('itemsReferenceDateSingleDonation', {
          reference,
          date,
        })}
      {count > 1 && (
        <button
          type="button"
          onClick={openPopover}
          className={styles.donationCount}
          aria-haspopup="true"
          aria-expanded={Boolean(popoverAnchor)}
        >
          {tReceipt.rich('itemsReferenceDateMultiDonation', {
            count,
            u: (chunks) => <span>{chunks}</span>,
          })}
        </button>
      )}
      <DonationInfoPopover
        closePopover={closePopover}
        popoverAnchor={popoverAnchor}
        donations={donations}
      />
    </div>
  );
};

export default DonationInfo;
