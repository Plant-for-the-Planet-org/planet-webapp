import type { APIError } from '@planet-sdk/common';
import type {
  DonationReceiptsStatus,
  IssuedReceiptDataApi,
  UnissuedReceiptDataAPI,
} from './donationReceiptTypes';

import { handleError } from '@planet-sdk/common';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import styles from './DonationReceipt.module.scss';
import SupportAssistanceInfo from './microComponents/SupportAssistanceInfo';
import { useContext, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import IssuedReceiptCard from './microComponents/IssuedReceiptCard';
import UnissuedReceiptCard from './microComponents/UnissuedReceiptCard';
import { useDonationReceiptContext } from '../../common/Layout/DonationReceiptContext';
import {
  transformProfileToDonorView,
  transformProfileToPrimaryAddressGuid,
  transformProfileToPrimaryAddressView,
} from './transformers';
import { useRouter } from 'next/router';
import { useApi } from '../../../hooks/useApi';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import NoDataFound from '../../../../public/assets/images/icons/projectV2/NoDataFound';
import getLocalizedPath from '../../../utils/localizedPath';

const DonationReceipts = () => {
  const { getApiAuthenticated } = useApi();
  const { user, contextLoaded } = useUserProps();
  const locale = useLocale();
  const tReceipt = useTranslations('DonationReceipt');
  const [donationReceipts, setDonationReceipts] =
    useState<DonationReceiptsStatus | null>(null);
  const [processReceiptId, setProcessReceiptId] = useState<string | null>(null);
  const { initForIssuance, initForVerification } = useDonationReceiptContext();
  const { redirect } = useContext(ErrorHandlingContext);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!user || !contextLoaded) return;
      try {
        const response = await getApiAuthenticated<DonationReceiptsStatus>(
          '/app/donationReceiptsStatus'
        );
        if (response) setDonationReceipts(response);
      } catch (error) {
        handleError(error as APIError);
        redirect('/');
      }
    })();
  }, []);

  const handleReceiptClick = (
    type: 'issued' | 'unissued',
    receipt: IssuedReceiptDataApi | UnissuedReceiptDataAPI
  ) => {
    setProcessReceiptId(
      type === 'issued'
        ? (receipt as IssuedReceiptDataApi).donations[0].reference
        : (receipt as UnissuedReceiptDataAPI).donations[0].uid
    );
    if (type === 'unissued') {
      const clickedReceipt = receipt as UnissuedReceiptDataAPI;

      const donorView = user ? transformProfileToDonorView(user) : null;
      const addressView = user
        ? transformProfileToPrimaryAddressView(user)
        : null;
      const addressGuid = user
        ? transformProfileToPrimaryAddressGuid(user)
        : null;

      if (!donorView || !addressView || !addressGuid) {
        console.error('❌ Missing user or primary address.');
        return;
      }

      initForIssuance(
        clickedReceipt,
        donorView,
        addressView,
        addressGuid,
        user
      );
    } else if (type === 'issued') {
      const clickedReceipt = receipt as IssuedReceiptDataApi;

      initForVerification(clickedReceipt, user);
    }

    router.push(getLocalizedPath('/profile/donation-receipt/verify', locale));
  };
  const hasNoReceipts =
    !donationReceipts?.issued.length && !donationReceipts?.unissued.length;

  if (!donationReceipts)
    return (
      <section className={styles.donorContactManagementLayout}>
        <Skeleton height={600} width={524} />
      </section>
    );

  if (hasNoReceipts)
    return (
      <section className={styles.donorContactManagementLayout}>
        <section className={styles.donationReceipts}>
          <NoDataFound />
          <span className={styles.noReceiptFound}>
            {tReceipt('noReceiptFound')}
          </span>
        </section>
      </section>
    );

  return (
    <section className={styles.donorContactManagementLayout}>
      <h1 className={styles.receiptListHeader}>
        {tReceipt('donationReceipt')}
      </h1>
      <section className={styles.donationReceipts}>
        {donationReceipts?.unissued.map((receipt) => (
          <UnissuedReceiptCard
            key={`unissued-${receipt.donations[0].uid}`}
            unissuedReceipt={receipt}
            onReceiptClick={() => handleReceiptClick('unissued', receipt)}
            isProcessing={processReceiptId === receipt.donations[0].uid}
          />
        ))}
        {donationReceipts?.issued.map((receipt) => (
          <IssuedReceiptCard
            key={`issued-${receipt.donations[0].reference}`}
            issuedReceipt={receipt}
            onReceiptClick={() => handleReceiptClick('issued', receipt)}
            isProcessing={processReceiptId === receipt.donations[0].reference}
          />
        ))}
      </section>
      <footer className={styles.receiptListFooter}>
        <SupportAssistanceInfo />
      </footer>
    </section>
  );
};

export default DonationReceipts;
