import React, {createContext, useContext, useState} from 'react';
import {
    transformAddress,
    transformDonor,
    transformIssuedDonation,
    transformUnissuedDonation
} from "../../user/DonationReceipt/transformers";
import type {
    AddressView,
    DonationView,
    DonorView,
    IssuedDonationApi,
    IssuedReceiptDataApi,
    Operation,
    ReceiptData,
    UnissuedDonationApi,
    UnissuedReceiptDataAPI,
} from "../../user/DonationReceipt/donationReceiptTypes";
import {RECEIPT_STATUS} from "../../user/DonationReceipt/utils";

// Define the state structure
interface DonationReceiptContextState {
    address: AddressView | null;
    addressGuid: string | null;
    amount: number | null;
    challenge: string | null;
    country: string | null;
    currency: string | null;
    donationCount: number | null;
    donationUids: string[];
    donations: DonationView[] | null;
    donor: DonorView | null;
    downloadUrl: string | null;
    dtn: string | null;
    isVerified: boolean;
    mustAuthenticate: boolean;
    operation: string | null;
    paymentDate: string;
    tinIsRequired: boolean;
    type: string | null;
    verificationDate: string | null;
    year: string | null;
}

// Default state
const defaultState: DonationReceiptContextState = {
    address: null,
    addressGuid: null,
    amount: null,
    challenge: null,
    country: null,
    currency: null,
    donationCount: null,
    donationUids: [],
    donations: null,
    donor: null,
    downloadUrl: null,
    dtn: null,
    isVerified: false,
    mustAuthenticate: false,
    operation: null,
    paymentDate: '',
    tinIsRequired: false,
    type: null,
    verificationDate: null,
    year: null,
};

// Context interface
interface DonationReceiptContextInterface {
    getDonor: () => DonorView | null;
    getAddress: () => AddressView | null;
    getAddressGuid: () => string | null;
    getReceiptData: () => ReceiptData | null;
    getOperation: () => Operation;
    getDonationUids: () => string[];
    getVerificationDate: () => string | null;
    initForVerification: (data: IssuedReceiptDataApi) => void;
    initForIssuance: (data: UnissuedReceiptDataAPI, donor: DonorView, address: AddressView, addressGuid: string) => void;
    updateDonorAndAddress: (donor: DonorView, address: AddressView, addressGuid: string) => void;
}

// Create context
const DonationReceiptContext = createContext<DonationReceiptContextInterface | null>(null);

// Provider component
export const DonationReceiptProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [state, setState] = useState<DonationReceiptContextState>(defaultState);

    // Initialize context for verification
    const initForVerification = (data: IssuedReceiptDataApi): void => {
        if (!data) return;

        console.log('Initializing for verification:', data);

        const donor = transformDonor(data.donor);
        const address = transformAddress(data.donor);
        const donations: DonationView[] = data.donations?.map((item: IssuedDonationApi) => transformIssuedDonation(item)) ?? [];
        const mustAuthenticate = (data.tinIsRequired ?? false) && !data.donor?.tin;
        const isVerified = !!data.verificationDate;
        const operation = isVerified ? RECEIPT_STATUS.DOWNLOAD : RECEIPT_STATUS.VERIFY;

        setState({
            address,
            addressGuid: null,
            amount: data.amount ?? null,
            challenge: data.challenge ?? null,
            country: data.country ?? null,
            currency: data.currency ?? null,
            donationCount: data.donationCount ?? null,
            donationUids: [],
            donations,
            donor,
            downloadUrl: data.downloadUrl ?? null,
            dtn: data.dtn ?? null,
            isVerified,
            mustAuthenticate,
            operation,
            paymentDate: data.paymentDate,
            tinIsRequired: data.tinIsRequired ?? false,
            type: null,
            verificationDate: data.verificationDate ?? null,
            year: data.year ?? null,
        });
    };

    // Initialize context for issuance
    const initForIssuance = (data: UnissuedReceiptDataAPI, donor: DonorView, address: AddressView, addressGuid: string): void => {
        if (!data) return;

        console.log('Initializing for issuance:', data);

        const donations: DonationView[] = data.donations?.map((item: UnissuedDonationApi) => transformUnissuedDonation(item)) ?? [];
        const mustAuthenticate = true;

        setState({
            address,
            addressGuid,
            amount: data.amount ?? null,
            challenge: null,
            country: data.country ?? null,
            currency: data.currency ?? null,
            dtn: null,
            donationCount: data.donationCount ?? null,
            donationUids: data.uids ?? [],
            donations,
            donor,
            downloadUrl: null,
            isVerified: false,
            mustAuthenticate,
            operation: RECEIPT_STATUS.ISSUE,
            paymentDate: data.paymentDate,
            tinIsRequired: data.tinIsRequired ?? false,
            type: data.type,
            verificationDate: null,
            year: null,
        });
    };

    // Update donor and address
    const updateDonorAndAddress = (donor: DonorView, address: AddressView, addressGuid: string): void => {
        setState((prevState) => ({
            ...prevState,
            donor,
            address,
            addressGuid,
        }));
    };

    // Context value
    const contextValue: DonationReceiptContextInterface = {
        getDonor: () => state.donor,
        getAddress: () => state.address,
        getAddressGuid: () => state.addressGuid,
        getOperation: (): Operation => {
            const operation = state.operation;
            return Object.values(RECEIPT_STATUS).includes(operation as Operation)
                ? (operation as Operation)
                : RECEIPT_STATUS.VERIFY;
        },
        getDonationUids: () => state.donationUids,
        getReceiptData: (): ReceiptData | null => {
            const {
                address,
                amount,
                challenge,
                country,
                currency,
                donationCount,
                donations,
                donor,
                downloadUrl,
                dtn,
                isVerified,
                paymentDate,
                year,
            } = state;

            // TODO: review the following validation
            return donor !== null && address !== null && amount !== null && currency !== null && country !== null && donations !== null && donationCount !== null
                ? {
                    address,
                    amount,
                    challenge,
                    country,
                    currency,
                    donationCount,
                    donations,
                    donor,
                    downloadUrl: downloadUrl ?? null,
                    dtn,
                    isVerified: isVerified ?? false,
                    paymentDate: paymentDate,
                    type: state.type,
                    year,
                }
                : null;
        },
        getVerificationDate: () => state.verificationDate,
        initForVerification,
        initForIssuance,
        updateDonorAndAddress,
    };

    return (
        <DonationReceiptContext.Provider value={contextValue}>
            {children}
        </DonationReceiptContext.Provider>
    );
};

// Hook to use the context
export const useDonationReceiptContext = (): DonationReceiptContextInterface => {
    const context = useContext(DonationReceiptContext);
    if (!context) {
        throw new Error('useDonationReceiptContext must be used within a DonationReceiptProvider');
    }
    return context;
};