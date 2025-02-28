import type { APIError } from '@planet-sdk/common';
import type { IssuedReceiptDataApi } from './donationReceiptTypes';

import { useContext, useEffect, useState } from 'react';
import { handleError } from '@planet-sdk/common';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/router';
import { useDonationReceiptContext } from '../../common/Layout/DonationReceiptContext';
import styles from './DonationReceipt.module.scss';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import DonationReceiptWrapper from './DonationReceiptWrapper';
import { useServerApi } from '../../../hooks/useServerApi';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { useTranslations } from 'next-intl';
import ReceiptVerificationErrors from './microComponents/ReceiptVerificationErrors';

const DonationReceiptUnauthenticated = () => {
  const router = useRouter();
  const tReceipt = useTranslations('DonationReceipt');

  const { getApi } = useServerApi();
  const [isLoading, setIsLoading] = useState(false);
  const [isReceiptInvalid, setIsReceiptInvalid] = useState(false);
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const { dtn, year, challenge } = router.query;
  const { initForVerification } = useDonationReceiptContext();
  const { user } = useUserProps();

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

        if (data) initForVerification(data, user);
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
  }, [
    dtn,
    year,
    challenge,
    router.isReady,
    areParamsValid,
    user,
    initForVerification,
  ]);

  if (!router.isReady) return null;

  if (isReceiptInvalid)
    return (
      <ReceiptVerificationErrors
        message={tReceipt.rich('errors.invalidReceipt', {
          b: (chunks) => <strong>{chunks}</strong>,
        })}
      />
    );

  if (isLoading)
    return (
      <div className={styles.donationReceiptSkeleton}>
        <Skeleton height={700} width={760} />
      </div>
    );

  return <DonationReceiptWrapper />;
};

export default DonationReceiptUnauthenticated;
