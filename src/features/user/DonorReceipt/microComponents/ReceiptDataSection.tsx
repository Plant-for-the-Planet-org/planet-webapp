import type { ReceiptData } from '../donorReceipt';
import type { APIError } from '@planet-sdk/common';

import { useCallback, useContext, useState } from 'react';
import { handleError } from '@planet-sdk/common';
import { CircularProgress } from '@mui/material';
import { useDonorReceipt } from '../../../common/Layout/DonorReceiptContext';
import styles from '../donationReceipt.module.scss';
import DonationData from './DonationData';
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
  donorReceiptData: ReceiptData | null;
}

const ReceiptDataSection = ({ donorReceiptData }: Prop) => {
  if (!donorReceiptData) return null;
  const { updateDonorReceiptData } = useDonorReceipt();
  const { tenantConfig } = useTenant();
  const { token, user, contextLoaded, logoutUser } = useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [isLoading, setIsLoading] = useState(false);
  const {
    issuedDonations,
    downloadUrl,
    operation,
    donor,
    address,
    hasDonorDataChanged,
    dtn,
    challenge,
    year,
  } = donorReceiptData;

  const confirmDonorData = useCallback(async () => {
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
        if (!(address.guid && token && user && contextLoaded)) return;
        const authData = await putAuthenticatedRequest({
          ...requestData,
          data: { ...requestData.data, receiptAddress: address.guid },
          token,
          logoutUser,
        });
        if (authData) {
          updateDonorReceiptData(authData);
          return;
        }
      }

      const data = await putRequest(requestData);
      if (data) updateDonorReceiptData(data);
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
    putAuthenticatedRequest,
    logoutUser,
    putRequest,
    updateDonorReceiptData,
    getVerificationDate,
    handleError,
    setErrors,
    setIsLoading,
  ]);

  return (
    <section className={styles.receiptDataSection}>
      <DonationData donations={issuedDonations} />
      <DonorDetails donor={donor} address={address} />
      {!isLoading ? (
        <ReceiptActions
          downloadUrl={downloadUrl}
          operation={operation}
          confirmDonorData={confirmDonorData}
        />
      ) : (
        <div className={styles.donorReceiptSpinner}>
          <CircularProgress color="success" />
        </div>
      )}
    </section>
  );
};

export default ReceiptDataSection;
