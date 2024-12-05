import React, {createContext, useContext, useState} from 'react';
import type {
    DonorView,
    AddressView,
    PendingDonationApi,
    PendingDonationView,
    IssuedDonationReceiptApi,
    PendingDonationReceiptApi, IssuedDonationView
} from "../../../types/donation-receipts";
import {
    transformAddress,
    transformDonationReceiptItem,
    transformDonor, transformIssuedDonation
} from "../../../types/donation-receipts/transformers";
import type {IssuedDonationApi} from "../../../types/donation-receipts";

interface DonationReceiptContextState {
    operation: string | null;
    address: AddressView | null;
    amount: number | null;
    challenge: string | null;
    currency: string | null;
    donationUids: string[];
    donor: DonorView | null;
    downloadUrl: string | null;
    dtn: string | null;
    isAuthenticated: boolean | null,
    isDirty: boolean;
    isVerified: boolean;
    issuedDonations: IssuedDonationView[] | null;
    mustAuthenticate: boolean | null,
    pendingDonations: PendingDonationView[] | null;
    tinIsRequired: boolean | null,
    verificationDate: string | null;
    year: string | null;
}

// Default state
const defaultState: DonationReceiptContextState = {
    operation: null,
    address: null,
    amount: null,
    challenge: null,
    currency: null,
    donationUids: [],
    donor: null,
    downloadUrl: null,
    dtn: null,
    isAuthenticated: null,
    isDirty: true,
    isVerified: false,
    issuedDonations: null,
    mustAuthenticate: null,
    pendingDonations: null,
    tinIsRequired: null,
    verificationDate: null,
    year: null,
};

// Create reference context
const DonationReceiptContext = createContext<{
    clearContext: () => void;
    initFromIssuedReceipt: (data: any) => void;
    initFromPendingReceipt: (data: PendingDonationReceiptApi, donor: DonorView, address: AddressView) => void;
    setAddress: (address: Partial<AddressView>) => void;
    setProfile: (profile: Partial<DonorView>) => void;
    state: DonationReceiptContextState;
    updateContext: (data: Partial<DonationReceiptContextState>) => void; // only use during development, replace with specific functions
    userLoggedIn: (profile: Partial<DonorView>, address: Partial<AddressView>) => void;
//    verifiedByUser: () => Promise<void>;
} | null>(null);

// Provider
export const DonationReceiptContextProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {

    console.log('DonationReceiptProvider initialized');

    const [state, setState] = useState<DonationReceiptContextState>(defaultState);

    const updateContext = (data: Partial<DonationReceiptContextState>) => {
        setState((prevState) => ({...prevState, ...data}));
    };

    // TODO: analyze which properties should actually be cleared
    const clearContext = () => {
        setState((prevState) => ({
            ...prevState,
            operation: null
        }));
    };

    const setDonations = (data: undefined) => {

        setState((prevState) => ({
            ...prevState,
            operation: 'issue',
            donationUids: data.uids,
            donations: data.items,
            dtn: null,
            challenge: null,
            year: null,
            verificationDate: null,
            isVerified: false,
            mustAuthenticate: true,
        }));
    };

    const initFromIssuedReceipt = (data: IssuedDonationReceiptApi) => {
        console.log('Initializing from receipt: ', data)
        const donor = transformDonor(data.donor);
        const address = transformAddress(data.donor);
        const issuedDonations: IssuedDonationView[] = data.donations?.map((item: IssuedDonationApi) => transformIssuedDonation(item));
        const tinIsRequired = data.tinIsRequired;
        const mustAuthenticate = (tinIsRequired || false) && (data.donor.tin || null) === null || false;
        const verificationDate = data.verificationDate || null;
        const isVerified = verificationDate !== null;
        const operation = isVerified ? 'download' : 'verify';

        setState((prevState) => ({
            ...prevState,
            operation,
            address,
            amount: data.amount,
            challenge: data.challenge,
            currency: data.currency,
            donor,
            dtn: data.dtn,
            isVerified,
            issuedDonations,
            mustAuthenticate,
            tinIsRequired,
            verificationDate,
            year: data.year,
        }));
    };
    const initFromPendingReceipt = (receipt: PendingDonationReceiptApi, donor: DonorView, address: AddressView) => {
        console.log('Initializing from pending receipt: ', receipt)

        const pendingDonations: PendingDonationView[] = receipt.donations?.map((item: PendingDonationApi) => transformDonationReceiptItem(item));
        const donationUids = receipt.uids;
        const tinIsRequired = receipt.tinIsRequired;
        const verificationDate = receipt.verificationDate || null;
        const isVerified = verificationDate !== null;
        const mustAuthenticate = true;

        setState((prevState) => ({
            ...prevState,
            operation: 'issue',
            address,
            donor,
            amount: receipt.amount,
            currency: receipt.currency,
            donationUids,
            isVerified,
            mustAuthenticate,
            pendingDonations,
            tinIsRequired,
            verificationDate,
        }));
    };

    /**
     * This function is called when the user has updated or selected a new address.
     * It implies that the user has not verified the tax receipt yet.
     */
    const setAddress = (address: Partial<AddressView>) => {
        setState((prevState) => ({
            ...prevState,
            address: {
                ...prevState.address,
                ...address,
            } as AddressView,
            verificationDate: null,
            isVerified: false,
            isDirty: true,
        }));
    };

    /**
     * This function is called when the user has updated his profile (name, TIN, etc.)
     * It implies that the user has not verified the tax receipt yet.
     */
    const setProfile = (profile: Partial<DonorView>) => {
        setState((prevState) => ({
            ...prevState,
            donor: {
                ...prevState.donor,
                ...profile
            } as DonorView,
            verificationDate: null,
            isVerified: false,
            isDirty: true,
        }));
    };

    /**
     * When a user logs in (potentially because he was forced to do so based on state.mustAuthenticate),
     * This function is called to update the context with the user's profile and the primary address.
     * This implies that the user has not verified the tax receipt yet.
     */
    const userLoggedIn = (profile: Partial<DonorView>, address: Partial<AddressView>) => {
        setState((prevState) => ({
            ...prevState,
            donor: {
                ...prevState.donor,
                ...profile
            } as DonorView,
            address: {
                ...prevState.address,
                ...address,
            } as AddressView,
            verificationDate: null,
            isVerified: false,
            isDirty: true,
        }));
    };

    // TODO: This method has been moved and is probably obsolete here
    // /**
    //  * Verify or issue a donation receipt (must be called when the user clicks on the confirm button)
    //  * If the operation = `verify`, an API call is made to notify the backend that the user has verified the receipt.
    //  * If the operation = `issue`, an API call is made to issue a new tax receipt.
    //  * In both cases, the state is updated with the verification date and the isVerified flag.
    //  */
    // const verifiedByUser = async () => {
    //     try {
    //         const verificationDate = new Date().toISOString();
    //         let response;
    //
    //         if (!state.address.guid) {
    //             throw new Error('AddressPanel GUID is missing. Cannot proceed.');
    //         }
    //
    //         if (state.operation === 'verify') {
    //             // state.address.guid will be null when the user has confirmed without modifying address or profile the
    //             // backend will interpret this as a verification that does not require any update of the tax receipt data
    //             // otherwise, the backend will update the tax receipt with the new address and also
    //             // update the donor data from the profile
    //             response = await fetch(
    //                 `/app/donationReceipt/verify?dtn=${state.dtn}&challenge=${state.challenge}&year=${state.year}`,
    //                 {
    //                     method: 'PUT',
    //                     headers: {'Content-Type': 'application/json'},
    //                     body: JSON.stringify({
    //                         verificationDate,
    //                         receiptAddress: state.address.guid,
    //                     }),
    //                 }
    //             );
    //         } else if (state.operation === 'issue') {
    //             if (!state.donationUids || state.donationUids.length === 0) {
    //                 throw new Error('Donation UIDs are missing. Cannot proceed.');
    //             }
    //
    //             // ask the backend to issue a verified, new tax receipt with the authenticated user's address and
    //             // profile data for the donations identified by state.uids
    //             response = await fetch(`/app/donationReceipts`,
    //                 {
    //                     method: 'POST',
    //                     headers: {'Content-Type': 'application/json'},
    //                     body: JSON.stringify({
    //                         verificationDate,
    //                         receiptAddress: state.address.guid,
    //                         donationUids: state.donationUids,
    //                     }),
    //                 }
    //             );
    //         }
    //
    //         if (!response.ok) {
    //             throw new Error(
    //                 `Failed to ${state.operation === 'verify' ? 'verify' : 'issue'} tax receipt.`
    //             );
    //         }
    //
    //         // Update context state only after successful API response
    //         setState((prevState) => ({
    //             ...prevState,
    //             operation: 'download',
    //             verificationDate,
    //             isVerified: state.operation === 'verify', // Only mark as verified for the `verify` operation
    //         }));
    //     } catch (error) {
    //         console.error('Error during operation:', error.message);
    //         alert(`Operation failed: ${error.message}`); // User-friendly feedback
    //     }
    // };

    return (
        <DonationReceiptContext.Provider value={{
            state,
            clearContext,
            initFromIssuedReceipt,
            initFromPendingReceipt,
            setAddress,
            setProfile,
            updateContext, // should be replaced with specific functions
            userLoggedIn,
            // verifiedByUser,
        }}>
            {children}
        </DonationReceiptContext.Provider>
    );
};

export const useDonationReceiptContext = () => {
    const context = useContext(DonationReceiptContext);
    if (!context) {
        throw new Error('useDonationReceiptContext must be used within a DonationReceiptContextProvider');
    }
    return context;
};
