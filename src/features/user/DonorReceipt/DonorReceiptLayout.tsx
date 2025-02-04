import type { ReceiptDataAPI } from './donorReceipt';
import type { APIError } from '@planet-sdk/common';

import { useContext, useEffect, useState } from 'react';
import { handleError } from '@planet-sdk/common';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/router';
import { useDonorReceipt } from '../../common/Layout/DonorReceiptContext';
import styles from './DonationReceipt.module.scss';
import ReceiptDataSection from './microComponents/ReceiptDataSection';
import ReceiptVerificationHeader from './microComponents/ReceiptVerificationHeader';
import ReceiptListRedirect from './microComponents/ReceiptListRedirect';
import { useTenant } from '../../common/Layout/TenantContext';
import { getRequest } from '../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';

export const DonorReceiptLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { tenantConfig } = useTenant();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const router = useRouter();
  const { dtn, year, challenge } = router.query;
  const { updateDonorReceiptData, donorReceiptData } = useDonorReceipt();
  const showReceipt = !isLoading && donorReceiptData !== null;

  useEffect(() => {
    if (!(dtn || year || challenge || router.isReady)) return;
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
        if (data) updateDonorReceiptData(data);
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceiptData();
  }, [dtn, year, challenge, router.isReady]);

  return showReceipt ? (
    <div className={styles.donorReceiptLayout}>
      <div className={styles.donorReceiptContainer}>
        <ReceiptVerificationHeader operation={donorReceiptData.operation} />
        <ReceiptDataSection donorReceiptData={donorReceiptData} />
        <ReceiptListRedirect />
      </div>
    </div>
  ) : (
    <div className={styles.donorReceiptSkeleton}>
      <Skeleton height={700} width={760} />
    </div>
  );
};

export default DonorReceiptLayout;
