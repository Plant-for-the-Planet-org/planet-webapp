import type { ReceiptData, ReceiptDataAPI } from '../donationReceiptTypes';
import type { APIError } from '@planet-sdk/common';

import { useCallback, useContext, useState } from 'react';
import { handleError } from '@planet-sdk/common';
import { CircularProgress } from '@mui/material';
import { useDonationReceipt } from '../../../common/Layout/DonationReceiptContext';
import styles from '../DonationReceipt.module.scss';
import DonationsTable from './DonationsTable';
import ReceiptActions from './ReceiptActions';
import DonorDetails from './DonorDetails';
import { getVerificationDate, RECEIPT_STATUS } from '../utils';
import { useTenant } from '../../../common/Layout/TenantContext';
import { putRequest } from '../../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';

interface Prop {
  donationReceiptData: ReceiptData;
}

const ReceiptDataSection = ({ donationReceiptData }: Prop) => {
  const { updateDonationReceiptData } = useDonationReceipt();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [isLoading, setIsLoading] = useState(false);
  const {
    donations,
    downloadUrl,
    operation,
    donor,
    address,
    hasDonorDataChanged,
    dtn,
    challenge,
    year,
    amount,
    currency,
  } = donationReceiptData;

  const confirmReceiptData = useCallback(async () => {
    if (operation !== RECEIPT_STATUS.VERIFY) return;
    if (hasDonorDataChanged) {
      //TODO: PUT Authentication request logic
    }

    try {
      setIsLoading(true);
      const data = await putRequest<ReceiptDataAPI>({
        tenant: tenantConfig.id,
        url: `/app/donationReceipt/verify`,
        data: {
          dtn,
          challenge,
          year,
          verificationDate: getVerificationDate(),
        },
      });
      if (data) updateDonationReceiptData(data);
    } catch (error) {
      setErrors(handleError(error as APIError));
    } finally {
      setIsLoading(false);
    }
  }, [
    operation,
    hasDonorDataChanged,
    tenantConfig.id,
    dtn,
    challenge,
    year,
    updateDonationReceiptData,
  ]);
  const { address1, zipCode, city, country } = address;
  const hasMultipleDonations = donations.length > 1;
  const isAddressInvalid = !address1 || !zipCode || !city || !country;
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
          isReceiptVerified={donationReceiptData.verificationDate !== null}
          isContactInfoInvalid={isContactInfoInvalid}
        />
      ) : (
        <div className={styles.receiptVerificationSpinner}>
          <CircularProgress color="success" />
        </div>
      )}
    </section>
  );
};

export default ReceiptDataSection;
