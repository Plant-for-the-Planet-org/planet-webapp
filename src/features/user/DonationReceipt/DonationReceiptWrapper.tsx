import type { IssuedReceiptDataApi } from './donationReceiptTypes';

import { useEffect, useState } from 'react';
import { useDonationReceiptContext } from '../../common/Layout/DonationReceiptContext';
import DonationReceipt from './microComponents/DonationReceipt';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './DonationReceipt.module.scss';
import { useApi } from '../../../hooks/useApi';
import { RECEIPT_STATUS } from './donationReceiptTypes';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { validateOwnership } from './DonationReceiptValidator';
import { useTranslations } from 'next-intl';
import ReceiptVerificationErrors from './microComponents/ReceiptVerificationErrors';

type ReceiptVerificationPayload = {
  dtn: string | null;
  challenge: string | null;
  year: string | null;
  verificationDate: string;
  receiptAddress?: string;
};

type DonationReceiptPayload = {
  receiptAddress: string | null;
  donationUids: string;
  verificationDate: string;
};

const DonationReceiptWrapper = () => {
  const {
    getReceiptData,
    getOperation,
    getDonor,
    getAddress,
    getAddressGuid,
    getDonationUids,
    initForVerification,
    email,
    isValid,
    clearSessionStorage,
  } = useDonationReceiptContext();

  const { user } = useUserProps();
  const { putApi, putApiAuthenticated, postApiAuthenticated } = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const receiptData = getReceiptData();
  const operation = getOperation();
  const isOwner = validateOwnership(email, user);
  const tReceipt = useTranslations('DonationReceipt');

  useEffect(() => {
    if (!isOwner) clearSessionStorage();
  }, [isOwner]);

  // The issuance of a receipt is not possible through a direct link.
  // It can only be done via the receipt list page.
  // The error component below is specifically dedicated to direct link access

  if (!isOwner && getOperation() !== RECEIPT_STATUS.ISSUE)
    return (
      <ReceiptVerificationErrors
        message={tReceipt.rich('errors.accessDeniedMessage', {
          b: (chunks) => <strong>{chunks}</strong>,
        })}
      />
    );

  const confirmReceiptData = async () => {
    const donor = getDonor();
    const address = getAddress();
    const addressGuid = getAddressGuid();
    const donationUids = getDonationUids();

    if (!donor || !address || !receiptData) {
      console.error('❌ Missing required data for confirmation.');
      return;
    }

    setIsLoading(true);

    try {
      let response = null;
      const verificationDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
      if (operation === RECEIPT_STATUS.VERIFY) {
        const payload: ReceiptVerificationPayload = {
          dtn: receiptData.dtn,
          challenge: receiptData.challenge,
          year: receiptData.year,
          // set to the current date time
          verificationDate,
          ...(addressGuid ? { receiptAddress: addressGuid } : {}),
        };
        response =
          addressGuid === null
            ? await putApi<IssuedReceiptDataApi, ReceiptVerificationPayload>(
                '/app/donationReceipt/verify',
                { payload }
              )
            : await putApiAuthenticated<
                IssuedReceiptDataApi,
                ReceiptVerificationPayload
              >('/app/donationReceipt/verify', { payload });
      } else if (operation === RECEIPT_STATUS.ISSUE) {
        const payload: DonationReceiptPayload = {
          receiptAddress: addressGuid,
          donationUids: donationUids.join(','),
          verificationDate,
        };

        response = await postApiAuthenticated<
          IssuedReceiptDataApi,
          DonationReceiptPayload
        >('/app/donationReceipts', { payload });
      }

      if (response) {
        initForVerification(response, null);
      } else {
        console.error('❌ Failed to process receipt.');
      }
    } catch (error) {
      console.error('❌ Error during receipt operation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!receiptData) {
    return (
      <div className={styles.donationReceiptSkeleton}>
        <Skeleton height={700} width={760} />
      </div>
    );
  }

  return (
    <DonationReceipt
      donationReceipt={receiptData}
      isLoading={isLoading}
      isValid={isValid}
      operation={operation}
      confirmReceiptData={confirmReceiptData}
    />
  );
};

export default DonationReceiptWrapper;
