import type { APIError } from '@planet-sdk/common';
import type { DonationReceiptsStatus } from './donationReceiptTypes';

import { handleError } from '@planet-sdk/common';
import { getAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { useTenant } from '../../common/Layout/TenantContext';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import styles from './DonationReceipt.module.scss';
import SupportAssistanceInfo from './microComponents/SupportAssistanceInfo';
import { useEffect, useState } from 'react';

const DonationReceipts = () => {
  const { user, contextLoaded, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const [donationReceipts, setDonationReceipts] =
    useState<DonationReceiptsStatus | null>(null);

  useEffect(() => {
    const fetchDonationReceipts = async () => {
      if (!user || !contextLoaded || !token) return;
      try {
        const response = await getAuthenticatedRequest<DonationReceiptsStatus>({
          tenant: tenantConfig.id,
          url: '/app/donationReceiptsStatus',
          token,
          logoutUser,
        });
        if (response) setDonationReceipts(response);
      } catch (error) {
        handleError(error as APIError);
      }
    };

    fetchDonationReceipts();
  }, []);

  return (
    <section className={styles.donationReceiptLayout}>
      <footer className={styles.receiptListFooter}>
        <SupportAssistanceInfo />
      </footer>
    </section>
  );
};

export default DonationReceipts;
