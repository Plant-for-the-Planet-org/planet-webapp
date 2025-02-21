import type { ReceiptData } from '../donationReceiptTypes';

import { CircularProgress } from '@mui/material';
import styles from '../DonationReceipt.module.scss';
import DonationsTable from './DonationsTable';
import ReceiptActions from './ReceiptActions';
import DonorDetails from './DonorDetails';

interface ReceiptDataSectionProps {
  donationReceipt: ReceiptData;
  isLoading: boolean;
  confirmReceiptData: () => Promise<void>;
}

const ReceiptDataSection = ({ donationReceipt,
                              isLoading,
                              confirmReceiptData,
                            }: ReceiptDataSectionProps) => {
  const {amount, currency, downloadUrl, isVerified, donor, address, donations} = donationReceipt;
  const hasMultipleDonations = donations.length > 1;
  const isAddressInvalid = !address.address1 || !address.zipCode || !address.city || !address.country;
  const isContactInfoInvalid = isAddressInvalid || !donor.name;

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
            isAddressInvalid={isAddressInvalid}
        />
        {!isLoading ? (
            <ReceiptActions
                downloadUrl={downloadUrl}
                confirmReceiptData={confirmReceiptData}
                isReceiptVerified={isVerified}
                isContactInfoInvalid={isContactInfoInvalid}
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