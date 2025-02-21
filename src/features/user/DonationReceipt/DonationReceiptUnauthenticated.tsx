import type { APIError } from '@planet-sdk/common';
import { useContext, useEffect, useState } from 'react';
import { handleError } from '@planet-sdk/common';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/router';
import { useDonationReceiptContext } from '../../common/Layout/DonationReceiptContext';
import styles from './DonationReceipt.module.scss';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import VerifyReceiptFooter from './microComponents/VerifyReceiptFooter';
import ReceiptValidationError from './microComponents/ReceiptValidationError';
import { useAuth0 } from '@auth0/auth0-react';
import { IssuedReceiptDataApi } from './donationReceiptTypes';
import DonationReceiptWrapper from './DonationReceiptWrapper';
import { useServerApi } from '../../../hooks/useServerApi';

const DonationReceiptUnauthenticated = () => {
    const { getApi } = useServerApi();
    const [isLoading, setIsLoading] = useState(false);
    const [isInvalidReceipt, setIsInvalidReceipt] = useState(false);
    const { setErrors, redirect } = useContext(ErrorHandlingContext);
    const router = useRouter();
    const { dtn, year, challenge } = router.query;
    const { initForVerification, getDonor } = useDonationReceiptContext();
    const { isAuthenticated } = useAuth0();

    // Check if query parameters are valid
    useEffect(() => {
        if (!router.isReady) return;
        setIsInvalidReceipt(!dtn || !year || !challenge);
    }, [dtn, year, challenge, router.isReady]);

    useEffect(() => {
        let isMounted = true;
        if (!router.isReady || isInvalidReceipt || getDonor()) return;
        if (typeof dtn !== 'string' || typeof year !== 'string' || typeof challenge !== 'string') return;

        (async () => {
            setIsLoading(true);
            try {
                const url = `/app/donationReceipt?dtn=${encodeURIComponent(dtn)}&year=${encodeURIComponent(year)}&challenge=${encodeURIComponent(challenge)}`;
                const data = await getApi<IssuedReceiptDataApi>(url);

                if (data && isMounted) {
                    initForVerification(data);
                    if (!isAuthenticated) {
                        sessionStorage.setItem('receiptData', JSON.stringify({ dtn, year, challenge }));
                    }
                }
            } catch (err) {
                const errorResponse = err as APIError;
                setErrors(handleError(errorResponse));

                if (errorResponse.statusCode === 400) setIsInvalidReceipt(true);
                else redirect('/');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [dtn, year, challenge, router.isReady, isInvalidReceipt, getDonor]);

    // Handle invalid receipt
    if (!dtn || !year || !challenge || isInvalidReceipt) {
        return (
            <div className={styles.donationReceiptLayout}>
                <div className={styles.donationReceiptContainer}>
                    <ReceiptValidationError />
                    <VerifyReceiptFooter />
                </div>
            </div>
        );
    }

    // Show loading skeleton while fetching data
    if (isLoading || !router.isReady) {
        return (
            <div className={styles.donationReceiptSkeleton}>
                <Skeleton height={700} width={760} />
            </div>
        );
    }

    // Render the receipt details using the common wrapper
    return (
        <div className={styles.donationReceiptLayout}>
            <div className={styles.donationReceiptContainer}>
                <DonationReceiptWrapper />
            </div>
        </div>
    );
};

export default DonationReceiptUnauthenticated;