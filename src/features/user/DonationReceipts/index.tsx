import React, {useEffect, useState, useCallback} from 'react';
import type {DonationReceiptsStatusResponse, DonorView, PendingDonationReceiptApi} from '../../../types/donation-receipts';
import {useRouter} from 'next/router';
import {useServerApi} from '../../../hooks/useServerApi';
import type {
    AddressView,
    IssuedDonationReceiptApi
} from "../../../types/donation-receipts";
import {useDonationReceiptContext} from "../../common/Layout/DonationReceiptContext";
import IssuedReceiptsList from './IssuedReceiptsList';
import PendingReceiptsList from './PendingReceiptsList';
import {useUserProps} from "../../common/Layout/UserPropsContext";

const DonationReceipts = () => {
    console.log('DonationReceipts component rendered');

    const {user} = useUserProps();
    console.log('user', user);

    const [donationReceipts, setDonationReceipts] = useState<DonationReceiptsStatusResponse>({
        issued: [],
        pending: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const {getApiAuthenticated} = useServerApi();
    const {
        initFromIssuedReceipt,
        initFromPendingReceipt,
        clearContext,
        state,
    } = useDonationReceiptContext();

    // fetches issued and pending donation receipts
    // resets the context operation after fetching donation receipts
    // we memoize with useCallback so the function does not get recreated on every render
    // TODO: implement error handling
    const fetchDonationReceipts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching donation receipts...');
            const response = await getApiAuthenticated<DonationReceiptsStatusResponse>('/app/donationReceiptsStatus');

            console.log('API response received:', response);
            console.log('Saving issued and pending receipts in local state ...')
            setDonationReceipts(response);

            // Reset context operation after fetching donation receipts
            // TODO: this could be done by a reset function in the context that would keep the authenticated user data
            clearContext();
            console.log('Context operation reset after fetching donation receipts');
        } catch (err: unknown) {
            console.error('Failed to fetch donation receipts:', err);
            setError(err.message || 'Failed to load donation receipts');
        } finally {
            setLoading(false);
        }
    }, [getApiAuthenticated, clearContext]);

    // Fetch data on component mount
    useEffect(() => {
        fetchDonationReceipts();
    }, []);

    // for debugging purposes only, remove after testing
    useEffect(() => {
        console.log('State has been updated:', state);
    }, [state]);

    // redirect to verification or issuance page based on context operation
    useEffect(() => {
        if (state.operation === 'verify') {
            console.log('Navigating to verification page...');
            router.push(`/profile/donation-receipts/${state.dtn}?challenge=${state.challenge}&year=${state.year}`);
        }
        if (state.operation === 'issue') {
            console.log('Navigating to issuance page...');
            router.push(`/profile/donation-receipts/issue`);
        }
    }, [state.operation, state.dtn, router]);

    const handleVerification = (receipt: IssuedDonationReceiptApi) => {
        console.log('Updating context with issued receipt and navigating to verification page...');
        console.log('IssuedDonationReceiptApi', receipt);

        initFromIssuedReceipt(receipt);

        router.push(`/profile/donation-receipts/${receipt.dtn}`);
    };

    const handleIssuance = (receipt: PendingDonationReceiptApi) => {
        console.log('Updating context with pending receipt and navigating to verification page...');
        console.log('PendingDonationReceiptApi', receipt);

        const donor: DonorView = {
            name: user?.type === 'individual'
                ? user?.firstname + ' ' + user?.lastname
                : user?.name || null,
            tin: user?.tin || null,
            type: user?.type || null,
        };
        const primaryAddress = user?.addresses.find((address) => address.type === 'primary');
        const address: AddressView = {
            guid: primaryAddress?.id || null,
            address1: primaryAddress?.address || '',
            address2: primaryAddress?.address2 || '',
            city: primaryAddress?.city || '',
            zipCode: primaryAddress?.zipCode || '',
            country: primaryAddress?.country || '',
        };

        initFromPendingReceipt(receipt, donor, address);

        router.push(`/profile/donation-receipts/issue`);
    };

    if (loading) {
        return <p>Loading donation receipts...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const panelStyle = {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
    };
    const headerStyle = {marginBottom: '10px', color: '#555', fontWeight: 'bold'};

    return (
        <div style={{marginTop: '50px', fontFamily: 'Arial, sans-serif', padding: '20px'}}>
            <h1 style={{textAlign: 'center', color: '#333'}}>Donation Receipts</h1>

            <div style={panelStyle}>
                <h2 style={headerStyle}>Issued Receipts</h2>
                <IssuedReceiptsList receipts={donationReceipts.issued} onVerify={handleVerification}/>
            </div>

            <div style={panelStyle}>
                <h2 style={headerStyle}>Pending Receipts</h2>
                <PendingReceiptsList receipts={donationReceipts.pending} onVerify={handleIssuance}/>
            </div>
        </div>
    );
};

export default DonationReceipts;
