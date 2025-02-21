import type {APIError} from '@planet-sdk/common';
import type {DonationReceiptsStatus, IssuedReceiptDataApi, UnissuedReceiptDataAPI} from './donationReceiptTypes';

import {handleError} from '@planet-sdk/common';
import {useUserProps} from '../../common/Layout/UserPropsContext';
import styles from './DonationReceipt.module.scss';
import SupportAssistanceInfo from './microComponents/SupportAssistanceInfo';
import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import IssuedReceiptCard from './microComponents/IssuedReceiptCard';
import UnissuedReceiptCard from './microComponents/UnissuedReceiptCard';
import {useDonationReceiptContext} from '../../common/Layout/DonationReceiptContext';
import {
    transformProfileToDonorView,
    transformProfileToPrimaryAddressGuid,
    transformProfileToPrimaryAddressView
} from "./transformers";
import {useRouter} from "next/router";
import {useServerApi} from "../../../hooks/useServerApi";

const DonationReceipts = () => {
    const {getApiAuthenticated} = useServerApi();
    const {user, contextLoaded} = useUserProps();
    const tReceipt = useTranslations('DonationReceipt');
    const [donationReceipts, setDonationReceipts] =
        useState<DonationReceiptsStatus | null>(null);
    const {initForIssuance, initForVerification} = useDonationReceiptContext();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            if (!user || !contextLoaded) return;
            try {
                const response = await getApiAuthenticated<DonationReceiptsStatus>('/app/donationReceiptsStatus');
                if (response) setDonationReceipts(response);
            } catch (error) {
                handleError(error as APIError);
            }
        })();
    }, []);

    const handleReceiptClick = (type: 'issued' | 'unissued', receipt: IssuedReceiptDataApi | UnissuedReceiptDataAPI) => {
        if (type === 'unissued') {
            const clickedReceipt = receipt as UnissuedReceiptDataAPI;
            console.log('🟢 Unissued Receipt clicked:', clickedReceipt);

            const donorView = user ? transformProfileToDonorView(user) : null;
            const addressView = user ? transformProfileToPrimaryAddressView(user) : null;
            const addressGuid = user ? transformProfileToPrimaryAddressGuid(user) : null;

            if (!donorView || !addressView || !addressGuid) {
                console.error('❌ Missing user or primary address.');
                return;
            }

            initForIssuance(clickedReceipt, donorView, addressView, addressGuid);

        } else if (type === 'issued') {
            const clickedReceipt = receipt as IssuedReceiptDataApi;
            console.log('🟢 Issued Receipt clicked:', clickedReceipt);

            initForVerification(clickedReceipt);
        }

        router.push('/profile/donation-receipt/verify')
            .then(() => console.log('🚀 Navigating to verification page...'));
    };

    return (
        <section className={styles.donorContactManagementLayout}>
            <h1 className={styles.receiptListHeader}>{tReceipt('taxReceipts')}</h1>
            <section className={styles.donationReceipts}>
                {donationReceipts?.unissued.map((receipt) => (
                    <UnissuedReceiptCard
                        key={`unissued-${receipt.donations[0].uid}`}
                        unissuedReceipt={receipt}
                        onReceiptClick={() => handleReceiptClick('unissued', receipt)}
                    />
                ))}
                {donationReceipts?.issued.map((receipt) => (
                    <IssuedReceiptCard
                        key={`issued-${receipt.donations[0].reference}`}
                        issuedReceipt={receipt}
                        onReceiptClick={() => handleReceiptClick('issued', receipt)}
                    />
                ))}
            </section>
            <footer className={styles.receiptListFooter}>
                <SupportAssistanceInfo/>
            </footer>
        </section>
    );
};

export default DonationReceipts;
