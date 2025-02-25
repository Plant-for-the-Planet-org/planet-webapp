import type { APIError } from '@planet-sdk/common';
import { useContext, useEffect, useState } from 'react';
import { handleError } from '@planet-sdk/common';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/router';
import { useDonationReceiptContext } from '../../common/Layout/DonationReceiptContext';
import styles from './DonationReceipt.module.scss';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { useAuth0 } from '@auth0/auth0-react';
import type { IssuedReceiptDataApi } from './donationReceiptTypes';
import DonationReceiptWrapper from './DonationReceiptWrapper';
import { useServerApi } from '../../../hooks/useServerApi';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { useTranslations } from 'next-intl';
import ReceiptVerificationErrors from './microComponents/ReceiptVerificationErrors';

const DonationReceiptUnauthenticated = () => {
  const { getApi } = useServerApi();
  const [isLoading, setIsLoading] = useState(false);
  const [isReceiptInvalid, setIsReceiptInvalid] = useState(false);
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const router = useRouter();
  const { dtn, year, challenge } = router.query;
  const { initForVerification } = useDonationReceiptContext();
  const { isAuthenticated } = useAuth0();
  const { user } = useUserProps();
  const tReceipt = useTranslations('DonationReceipt');

  const areParamsValid =
    typeof dtn === 'string' &&
    typeof year === 'string' &&
    typeof challenge === 'string';

  useEffect(() => {
    if (!router.isReady || !areParamsValid) return;

    (async () => {
      setIsLoading(true);
      try {
        const url = `/app/donationReceipt?dtn=${encodeURIComponent(
          dtn
        )}&year=${encodeURIComponent(year)}&challenge=${encodeURIComponent(
          challenge
        )}`;
        const data = await getApi<IssuedReceiptDataApi>(url);

        if (data) {
          initForVerification(data, user);
          if (!isAuthenticated) {
            sessionStorage.setItem(
              'receiptData',
              JSON.stringify({ dtn, year, challenge })
            );
          }
        }
      } catch (err) {
        const errorResponse = err as APIError;
        setErrors(handleError(errorResponse));

        if (errorResponse.statusCode === 400) {
          setIsReceiptInvalid(true);
        } else {
          redirect('/');
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [dtn, year, challenge, router.isReady]);

  if (!router.isReady) return null;

  if (isReceiptInvalid)
    return (
      <ReceiptVerificationErrors
        message={tReceipt.rich('errors.invalidReceipt', {
          b: (chunks) => <strong>{chunks}</strong>,
        })}
      />
    );

  if (isLoading) {
    return (
      <div className={styles.donationReceiptSkeleton}>
        <Skeleton height={700} width={760} />
      </div>
    );
  }

  // Render the receipt details using the common wrapper
  return <DonationReceiptWrapper />;
};

export default DonationReceiptUnauthenticated;
