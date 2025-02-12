import type { ReceiptDataAPI } from './donationReceiptTypes';
import type { APIError } from '@planet-sdk/common';

import { useContext, useEffect, useState } from 'react';
import { handleError } from '@planet-sdk/common';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/router';
import { useDonationReceipt } from '../../common/Layout/DonationReceiptContext';
import styles from './DonationReceipt.module.scss';
import ReceiptDataSection from './microComponents/ReceiptDataSection';
import VerifyReceiptHeader from './microComponents/VerifyReceiptHeader';
import { useTenant } from '../../common/Layout/TenantContext';
import { getRequest } from '../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import VerifyReceiptFooter from './microComponents/VerifyReceiptFooter ';
import ReceiptValidationError from './microComponents/ReceiptValidationError';

const DonationReceiptLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidReceipt, setIsInvalidReceipt] = useState(false);
  const { tenantConfig } = useTenant();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const router = useRouter();
  const { dtn, year, challenge } = router.query;
  const { updateDonationReceiptData, donationReceiptData } =
    useDonationReceipt();

  useEffect(() => {
    if (!router.isReady) return;
    setIsInvalidReceipt(!dtn || !year || !challenge);
    setIsLoading(false);
  }, [dtn, year, challenge, router.isReady]);

  useEffect(() => {
    if (!router.isReady || isInvalidReceipt) return;
    if (
      typeof dtn !== 'string' ||
      typeof year !== 'string' ||
      typeof challenge !== 'string'
    )
      return;
    const fetchReceiptData = async () => {
      setIsLoading(true);
      try {
        const data = await getRequest<ReceiptDataAPI>({
          tenant: tenantConfig.id,
          url: '/app/donationReceipt',
          queryParams: {
            dtn,
            year,
            challenge,
          },
        });
        if (data) updateDonationReceiptData(data);
      } catch (err) {
        const errorResponse = err as APIError;
        setErrors(handleError(errorResponse));
        if (errorResponse.statusCode === 400) {
          setIsInvalidReceipt(true);
          return;
        }
        redirect('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceiptData();
  }, [dtn, year, challenge, router.isReady, isInvalidReceipt]);

  if (isInvalidReceipt) {
    return (
      <div className={styles.donationReceiptLayout}>
        <div className={styles.donationReceiptContainer}>
          <ReceiptValidationError />
        </div>
      </div>
    );
  }

  if (isLoading || !router.isReady) {
    return (
      <div className={styles.donationReceiptSkeleton}>
        <Skeleton height={700} width={760} />
      </div>
    );
  }
  return (
    <div className={styles.donationReceiptLayout}>
      <div className={styles.donationReceiptContainer}>
        {donationReceiptData && (
          <>
            <VerifyReceiptHeader operation={donationReceiptData.operation} />
            <ReceiptDataSection donationReceiptData={donationReceiptData} />
            <VerifyReceiptFooter />
          </>
        )}
      </div>
    </div>
  );
};

export default DonationReceiptLayout;
