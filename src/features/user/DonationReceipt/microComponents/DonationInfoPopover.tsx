import type {
  IssuedDonationApi,
  UnissuedDonationApi,
} from '../donationReceiptTypes';

import { Popover } from '@mui/material';
import { useTranslations } from 'next-intl';
import CrossIcon from '../../../../../public/assets/images/icons/projectV2/CrossIcon';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import styles from '../DonationReceipt.module.scss';

type Donation = UnissuedDonationApi | IssuedDonationApi;

type Props = {
  donations: Donation[];
  popoverAnchor: HTMLButtonElement | null;
  closePopover: () => void;
};

const getDonationReference = (item: Donation) =>
  'reference' in item ? item.reference : item.uid;

const DonationInfoPopover = ({
  donations,
  popoverAnchor,
  closePopover,
}: Props) => {
  const tReceipt = useTranslations('DonationReceipt');
  const open = Boolean(popoverAnchor);
  const id = open ? 'donation-info-popOver' : undefined;
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={popoverAnchor}
      onClose={closePopover}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '12px',
        },
      }}
    >
      <button
        type="button"
        className={styles.closeIconContainer}
        onClick={closePopover}
      >
        <CrossIcon width={10} />
      </button>
      <table className={styles.donationTable}>
        <thead>
          <tr>
            <th>{tReceipt('donationDetails.reference')}</th>
            <th>{tReceipt('donationDetails.paymentDate')}</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((item) => (
            <tr key={getDonationReference(item)}>
              <td>{getDonationReference(item)}</td>
              <td>{formatDate(item.paymentDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Popover>
  );
};

export default DonationInfoPopover;
