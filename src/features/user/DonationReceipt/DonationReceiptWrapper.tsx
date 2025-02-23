import React, {useState} from 'react';
import {useDonationReceiptContext} from '../../common/Layout/DonationReceiptContext';
import DonationReceipt from './microComponents/DonationReceipt';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './DonationReceipt.module.scss';
import {useServerApi} from '../../../hooks/useServerApi';
import {RECEIPT_STATUS} from './utils';
import type {IssuedReceiptDataApi} from './donationReceiptTypes';

import DebugPanel from "./DebugPanel";  // TODO: remove for production

const DonationReceiptWrapper = () => {
    const {
        getReceiptData,
        getOperation,
        getDonor,
        getAddress,
        getAddressGuid,
        getDonationUids,
        initForVerification,
        isValid,
        getDebugState, // TODO: remove for production
    } = useDonationReceiptContext();

    const {putApi, putApiAuthenticated, postApiAuthenticated} = useServerApi();
    const [isLoading, setIsLoading] = useState(false);
    const receiptData = getReceiptData();
    const operation = getOperation();

    const confirmReceiptData = async () => {
        const donor = getDonor();
        const address = getAddress();
        const addressGuid = getAddressGuid();
        const donationUids = getDonationUids();

        if (!donor || !address || !receiptData) {
            console.error('❌ Missing required data for confirmation.');
            alert('Required donor, address, or receipt data is missing.');
            return;
        }

        setIsLoading(true);

        try {
            let response = null;
            const verificationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            if (operation === RECEIPT_STATUS.VERIFY) {

                const payload = {
                    dtn: receiptData.dtn,
                    challenge: receiptData.challenge,
                    year: receiptData.year,
                    // set to the current date time
                    verificationDate,
                    ...(addressGuid ? {receiptAddress: addressGuid} : {}),
                };

                console.log('🔍 Verifying receipt with payload:', payload);
                response = addressGuid
                    ? await putApi<IssuedReceiptDataApi>('/app/donationReceipt/verify', payload)
                    : await putApiAuthenticated<IssuedReceiptDataApi>('/app/donationReceipt/verify', payload);

            } else if (operation === RECEIPT_STATUS.ISSUE) {
                const payload = {
                    receiptAddress: addressGuid,
                    donationUids: JSON.stringify(donationUids),
                    verificationDate,
                };

                console.log('📜 Issuing receipt with payload:', payload);
                response = await postApiAuthenticated<IssuedReceiptDataApi>('/app/donationReceipts', payload);
            }

            if (response) {
                console.log('✅ Receipt processed successfully:', response);
                alert('Receipt successfully processed.');
                initForVerification(response, null);
            } else {
                console.error('❌ Failed to process receipt.');
                alert('Failed to process receipt. Please check the details and try again.');
            }
        } catch (error) {
            console.error('❌ Error during receipt operation:', error);
            alert('An error occurred while processing the receipt.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!receiptData) {
        return (
            <div className={styles.donationReceiptSkeleton}>
                <Skeleton height={700} width={760}/>
            </div>
        );
    }

    return (
        <div>
            <DonationReceipt
                donationReceipt={receiptData}
                isLoading={isLoading}
                isValid={isValid}
                operation={operation}
                confirmReceiptData={confirmReceiptData}
            />

            <DebugPanel data={getDebugState()}/>
        </div>
    );
};

export default DonationReceiptWrapper;