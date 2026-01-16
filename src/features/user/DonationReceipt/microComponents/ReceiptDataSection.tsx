import type { ReceiptData } from '../donationReceiptTypes';

import { CircularProgress } from '@mui/material';
import styles from '../DonationReceipt.module.scss';
import DonationsTable from './DonationsTable';
import ReceiptActions from './ReceiptActions';
import DonorDetails from './DonorDetails';
import { useTranslations } from 'next-intl';
import { useAuthSession } from '../../../../hooks/useAuthSession';

interface ReceiptDataSectionProps {
  donationReceipt: ReceiptData;
  isLoading: boolean;
  confirmReceiptData: () => Promise<void>;
  isValid: boolean;
  tinIsRequired: boolean;
}

const ReceiptDataSection = ({
  donationReceipt,
  isLoading,
  confirmReceiptData,
  isValid,
  tinIsRequired,
}: ReceiptDataSectionProps) => {
  const {
    amount,
    currency,
    downloadUrl,
    isVerified,
    donor,
    address,
    donations,
  } = donationReceipt;
  const hasMultipleDonations = donations.length > 1;
  const { isAuthenticated } = useAuthSession();
  const tReceipt = useTranslations('DonationReceipt');
  return (
    <section className={styles.receiptDataSection}>
      <DonationsTable
        donations={donations}
        amount={hasMultipleDonations ? amount : null}
        currency={hasMultipleDonations ? currency : null}
      />
      <DonorDetails
        donor={donor}
        address={address}
        isAddressInvalid={
          !address.address1 ||
          !address.zipCode ||
          !address.city ||
          !address.country
        }
      />
      {tinIsRequired && !donor.tin && (
        <p className={styles.loginAlert}>
          {tReceipt.rich('notifications.missingTIN', {
            b: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      )}
      {!isAuthenticated && (
        <p className={styles.loginAlert}>
          {tReceipt.rich('notifications.loginRequired', {
            b: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      )}
      {!isLoading ? (
        <ReceiptActions
          downloadUrl={downloadUrl}
          confirmReceiptData={confirmReceiptData}
          isReceiptVerified={isVerified}
          isContactInfoInvalid={!isValid}
        />
      ) : (
        <div className={styles.donationReceiptSpinner}>
          <CircularProgress color="success" />
        </div>
      )}
    </section>
  );
};

export default ReceiptDataSection;
