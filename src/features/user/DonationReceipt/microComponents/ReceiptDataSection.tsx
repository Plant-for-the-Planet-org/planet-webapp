import type { VerifiedReceiptDataAPI, ReceiptData } from '../donationReceipt';
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
import {
  putAuthenticatedRequest,
  putRequest,
} from '../../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { useUserProps } from '../../../common/Layout/UserPropsContext';

interface Prop {
  donationReceiptData: ReceiptData;
}

const ReceiptDataSection = ({ donationReceiptData }: Prop) => {
  const { updateDonationReceiptData } = useDonationReceipt();
  const { tenantConfig } = useTenant();
  const { token, user, contextLoaded, logoutUser } = useUserProps();
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
  } = donationReceiptData;

  const confirmReceiptData = useCallback(async () => {
    if (operation !== RECEIPT_STATUS.VERIFY) return;
    setIsLoading(true);
    const requestData = {
      tenant: tenantConfig.id,
      url: `/app/donationReceipt/verify`,
      data: {
        dtn,
        challenge,
        year,
        verificationDate: getVerificationDate(),
      },
    };

    try {
      if (hasDonorDataChanged) {
        if (!address.guid || !token || !user || !contextLoaded) return;
        const authData = await putAuthenticatedRequest<VerifiedReceiptDataAPI>({
          ...requestData,
          data: { ...requestData.data, receiptAddress: address.guid },
          token,
          logoutUser,
        });
        if (authData) {
          updateDonationReceiptData(authData);
          return;
        }
      }

      const data = await putRequest<VerifiedReceiptDataAPI>(requestData);
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
    address.guid,
    token,
    contextLoaded,
    updateDonationReceiptData,
    getVerificationDate,
    setErrors,
    setIsLoading,
  ]);

  return (
    <section className={styles.receiptDataSection}>
      <DonationsTable donations={donations} />
      <DonorDetails donor={donor} address={address} />
      {!isLoading ? (
        <ReceiptActions
          downloadUrl={downloadUrl}
          operation={operation}
          confirmReceiptData={confirmReceiptData}
          isReceiptVerified={donationReceiptData.verificationDate !== null}
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
