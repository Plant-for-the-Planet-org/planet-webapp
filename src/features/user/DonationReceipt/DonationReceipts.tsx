import type { APIError } from '@planet-sdk/common';
import type {
  DonationReceiptsStatus,
  IssuedReceiptDataApi,
  UnissuedReceiptDataAPI,
  OverviewReceiptDownloadResponse,
} from './donationReceiptTypes';

import { handleError } from '@planet-sdk/common';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import styles from './DonationReceipt.module.scss';
import SupportAssistanceInfo from './microComponents/SupportAssistanceInfo';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import YearlyReceiptGroup from './microComponents/YearlyReceiptGroup';
import { useDonationReceiptContext } from '../../common/Layout/DonationReceiptContext';
import {
  transformProfileToDonorView,
  transformProfileToPrimaryAddressGuid,
  transformProfileToPrimaryAddressView,
} from './transformers';
import { useApi } from '../../../hooks/useApi';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import NoDataFound from '../../../../public/assets/images/icons/projectV2/NoDataFound';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import {
  groupReceiptsByYear,
  getSortedYears,
  getOverviewEligibilityForAllYears,
} from './receiptGroupingUtils';

const DonationReceipts = () => {
  const { getApiAuthenticated } = useApi();
  const { user, contextLoaded } = useUserProps();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const tReceipt = useTranslations('DonationReceipt');
  const [donationReceipts, setDonationReceipts] =
    useState<DonationReceiptsStatus | null>(null);
  const [processReceiptId, setProcessReceiptId] = useState<string | null>(null);
  const [overviewLoadingYear, setOverviewLoadingYear] = useState<string | null>(
    null
  );
  const { initForIssuance, initForVerification } = useDonationReceiptContext();
  const { redirect } = useContext(ErrorHandlingContext);

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

    router.push(localizedPath('/profile/donation-receipt/verify'));
  };

  const handleOverviewDownload = async (year: string) => {
    if (!user || overviewLoadingYear) return;

    setOverviewLoadingYear(year);

    try {
      // Make API call to download overview receipt for the specific year
      const response =
        await getApiAuthenticated<OverviewReceiptDownloadResponse>(
          `/app/overviewReceipt/${year}`
        );

      if (response?.downloadUrl) {
        window.open(response.downloadUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Failed to download overview receipt:', error);
      handleError(error as APIError);
    } finally {
      setOverviewLoadingYear(null);
    }
  };

  // Group receipts by year and get sorted years
  const groupedReceipts = useMemo(() => {
    return donationReceipts ? groupReceiptsByYear(donationReceipts) : {};
  }, [donationReceipts]);

  const sortedYears = useMemo(() => {
    return getSortedYears(groupedReceipts);
  }, [groupedReceipts]);

  const overviewEligibility = useMemo(() => {
    const lastConsolidatedYear = donationReceipts?.lastConsolidatedYear;
    if (!lastConsolidatedYear) return {};

    return (
      getOverviewEligibilityForAllYears(
        groupedReceipts,
        lastConsolidatedYear
      ) || {}
    );
  }, [groupedReceipts, donationReceipts?.lastConsolidatedYear]);

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
        {sortedYears.map((year) => {
          const eligibility = overviewEligibility[year];
          return (
            <YearlyReceiptGroup
              key={year}
              year={year}
              receipts={groupedReceipts[year]}
              onReceiptClick={handleReceiptClick}
              processReceiptId={processReceiptId}
              overviewButtonState={eligibility?.buttonState || 'hidden'}
              onOverviewDownload={
                eligibility?.isEligible
                  ? () => handleOverviewDownload(year)
                  : undefined
              }
              isOverviewLoading={overviewLoadingYear === year}
            />
          );
        })}
      </section>
      <footer className={styles.receiptListFooter}>
        <SupportAssistanceInfo />
      </footer>
    </section>
  );
};

export default DonationReceipts;
