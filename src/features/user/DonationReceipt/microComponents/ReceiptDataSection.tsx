import type { DonationReceiptData } from '../../../common/Layout/DonationReceiptContext';
import type { APIError } from '@planet-sdk/common';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { handleError } from '@planet-sdk/common';
import { useDonationReceipt } from '../../../common/Layout/DonationReceiptContext';
import styles from '../donationReceipt.module.scss';
import { donationData } from '../utils';
import DonationData from './DonationData';
import ReceiptActions from './ReceiptActions';
import RecipientDetails from './RecipientDetails';
import { getRequest } from '../../../../utils/apiRequests/api';
import { useTenant } from '../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';

const ReceiptDataSection = () => {
  const { setErrors } = useContext(ErrorHandlingContext);
  const { updateDonationReceiptData } = useDonationReceipt();
  const { tenantConfig } = useTenant();
  const { query } = useRouter();
  const { dtn, year, challenge } = query;

  useEffect(() => {
    if (!(dtn || year || challenge)) return;
    const fetchReceiptData = async () => {
      if (
        typeof dtn !== 'string' ||
        typeof year !== 'string' ||
        typeof challenge !== 'string'
      )
        return;
      try {
        const data = await getRequest<DonationReceiptData>({
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
        setErrors(handleError(err as APIError));
      }
    };

    fetchReceiptData();
  }, [dtn, year, challenge]);

  return (
    <section className={styles.receiptDataSection}>
      <DonationData donations={donationData.donations} />
      <RecipientDetails donar={donationData.donor} />
      <ReceiptActions downloadUrl={donationData.downloadUrl} />
    </section>
  );
};

export default ReceiptDataSection;
