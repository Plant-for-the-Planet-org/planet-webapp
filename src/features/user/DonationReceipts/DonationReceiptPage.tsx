import IssuedDonationsList from "./IssuedDonationsList";
import PendingDonationsList from "./PendingDonationsList";
import DonorPanel from "./DonorPanel";
import type {IssuedDonationReceiptApi} from "../../../types/donation-receipts";
import {format} from 'date-fns';
import {useDonationReceiptContext} from "../../common/Layout/DonationReceiptContext";
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useServerApi} from '../../../hooks/useServerApi';
import AddressPanel from "./AddressPanel";
import DebugPanel from "./DebugPanel";

/**
 * This page renders a single donation receipt for either verification, download, or issuance.
 * 3 different cases have to be handled:
 * 1. The page is accessed via a direct URL with the query parameters `dtn`, `challenge`, and `year`.
 *    In this case, the receipt is fetched from the server and displayed for verification.
 * 2. The user navigates from the donation receipts page by selecting a receipt to verify.
 *    In this case, the receipt data is already present in the context.
 * 3. The user navigates from the donation receipts page by selecting a receipt to issue.
 *    In this case, the receipt data is already present in the context.
 *
 * Detection of the cases:
 * 1. state.operation is empty and the query parameters `dtn`, `challenge`, and `year` are present in the URL.
 * 2. state.operation is 'verify'
 * 3. state.operation is 'issue'
 */
const DonationReceipt = () => {
    const router = useRouter();
    const {dtn, challenge, year} = router.query;
    const {state, updateContext, initFromIssuedReceipt} = useDonationReceiptContext();

    const [loading, setLoading] = useState(true); // State to manage loading status
    const {getApi, putApi, putApiAuthenticated, postApiAuthenticated} = useServerApi();

    useEffect(() => {
        // fetch the donation receipt and update the context only if the operation is not 'verify' and the state is dirty
        // isDirty is set to true when the receipt that was loaded has been modified but not yet verified
        const fetchReceiptData = async () => {
            // the receipt has been loaded (operation is 'verify') and has not been modified (state is not dirty)
            // do nothing and return
            // this is required to prevent the receipt from being reloaded when re-rendering is triggered
            if (state.operation === 'verify') {
                setLoading(false);
                return;
            }

            // Ensure query parameters are present
            if (challenge && year) {
                try {

                    // load receipt data from the backend obtaining a IssuedDonationReceiptApi object
                    const url = `/app/donationReceipt?dtn=${dtn}&challenge=${challenge}&year=${year}`;
                    console.log('Fetching donation receipt from ' + url);

                    const response = await getApi<IssuedDonationReceiptApi>(url);

                    console.log('API response received:', response);

                    // - update the context with the fetched data that is required to render the receipt
                    // - operation is set to 'verify' to indicate that the receipt has been fetched (it is null
                    //   when the page is created from am outside URL)
                    // - isDirty is set to false, indicating that the receipt has not been modified by the user
                    //   since it has been loaded
                    // - when a receipt is loaded via API, the address data is part of the donor object
                    //   and has to be extracted into the address object
                    initFromIssuedReceipt(response);

                    console.log('State after fetching receipt:', state);
                } catch (error) {
                    console.error('Failed to fetch receipt data:', error);
                } finally {
                    setLoading(false); // Stop loading after fetching
                }
            } else {
                setLoading(false); // Stop loading if parameters are missing

                // expect receipt data to already be in the context
            }
        };

        // handle the 3 cases described above
        if (state.operation === null) {
            // 1. load the receipt data from the server
            console.log('Case 1: load');
            fetchReceiptData();
        } else if (state.operation === 'verify') {
            // 2. expect receipt data to already be in the context
            console.log('Case 2: verify');
            setLoading(false);
            console.log('Inside DonationReceipt - loading:', loading);
        } else if (state.operation === 'issue') {
            // 3. expect receipt data to already be in the context
            console.log('Case 3: issue');
            setLoading(false);
        }
    }, [getApi, challenge, year, dtn, updateContext]);

    // Handler called by verify or issue button
    // !!! should be renamed to 'verifyOrIssueReceipt' so it can be called in both cases

    // After this function is called, the receipt is verified and the download URL is available
    // The context is updated with the verification date and the download URL and the operation is set to 'download'
    const verifyReceipt = async () => {

        const verificationDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        let response = null;
        try {

            if (state.operation === 'verify') {
                const url = `/app/donationReceipt/verify`;
                // the receipt data is either the original data fetched from the server (isDirty=false)
                // or the user has modified the data while being authenticated (isDirty=true)
                if (!state.isDirty) {
                    const payload = {dtn, challenge, year, verificationDate};
                    response = await putApi<IssuedDonationReceiptApi>(url, payload);
                } else {
                    // if the datas has been modified, the address GUID has to be included in the payload
                    // and the request has to be authenticated
                    const payload = {dtn, challenge, year, verificationDate, receiptAddress: state.address.guid};
                    response = await putApiAuthenticated<IssuedDonationReceiptApi>(url, payload);
                }
            }

            if (state.operation === 'issue') {
                const url = `/app/donationReceipts`;
                const payload = {
                    receiptAddress: state.address.guid,
                    donationUids: JSON.stringify(state.donationUids),
                    verificationDate,
                };
                console.log('Payload:', payload);
                response = await postApiAuthenticated<IssuedDonationReceiptApi>(url, payload);
            }

            if (response) {
                // !!! it might be advisable to update more properties of the context, when a receipt has been newly
                // issued, donor/address data might have changed ????
                console.log('PUT response received:', response);
                updateContext({
                    verificationDate,
                    operation: 'download',
                    isVerified: true,
                    downloadUrl: response.downloadUrl,
                });
            } else {
                console.error('Unexpected response:', response);
                alert('Failed to verify receipt. Please check the details and try again.');
            }

        } catch (error) {
            console.error('Error verifying receipt:', error);
            alert('Failed to verify receipt. Please try again later.');
        }

    }    // Show loading state until data is fetched
    if (loading) {
        return <p>Loading donation receipt...</p>;
    }

    const modifyDonor = () => {
        console.log('Navigating to donor modification page...');
        router.push(`/profile/donation-receipts/donor`);
    }

    console.log('Inside DonationReceipt, state:', state);

    const buttonStyle = {
        backgroundColor: '#007BFF', color: 'white', padding: '10px 20px', border: 'none',
        borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginLeft: '10px',
    };
    const panelStyle = {
        backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '20px',
    };

    const headerStyle = {marginBottom: '10px', color: '#555', fontWeight: 'bold'};

    return (
        <div style={{marginTop: '50px', fontFamily: 'Arial, sans-serif', padding: '20px'}}>
            <h1 style={{textAlign: 'center', color: '#333'}}>Donation Receipt: {dtn}</h1>

            <div style={panelStyle}>
                <h2 style={headerStyle}>Donor Information</h2>
                <DonorPanel {...state.donor} />
            </div>

            <div style={panelStyle}>
                <h2 style={headerStyle}>Address Information</h2>
                <AddressPanel {...state.address} />
            </div>

            <div style={panelStyle}>
                <h2 style={headerStyle}>Donations</h2>
                {(state.operation === 'verify' || state.operation === 'download') && (
                    <IssuedDonationsList donations={state.issuedDonations}/>
                )}
                {state.operation === 'issue' && (
                    <PendingDonationsList donations={state.pendingDonations}/>
                )}
            </div>

            {!state.isVerified && (
                <div style={{textAlign: 'center'}}>
                    <button style={buttonStyle} onClick={modifyDonor}>
                        Modify
                    </button>
                    <button style={buttonStyle} onClick={verifyReceipt}>
                        Verify
                    </button>
                </div>
            )}

            {state.downloadUrl && (
                <button
                    style={buttonStyle}
                    onClick={() => window.open(state.downloadUrl as string, '_blank')}
                >
                    Download
                </button>
            )}

            <DebugPanel data={state}/>
        </div>
    );
};

export default DonationReceipt;
