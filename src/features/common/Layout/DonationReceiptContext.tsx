import type { ReactNode } from 'react';
import type { User } from '@planet-sdk/common';
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
} from '../../user/DonationReceipt/donationReceiptTypes';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { RECEIPT_STATUS } from '../../user/DonationReceipt/donationReceiptTypes';
import {
  transformAddress,
  transformDonor,
  transformIssuedDonation,
  transformUnissuedDonation,
} from '../../user/DonationReceipt/transformers';
import {
  validateIssuedReceipt,
  validateUnissuedReceipt,
} from '../../user/DonationReceipt/DonationReceiptValidator';

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
  email: string | null;
  isValid: boolean;
  isVerified: boolean;
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
  email: null,
  isVerified: false,
  isValid: false,
  operation: null,
  paymentDate: '',
  tinIsRequired: false,
  type: null,
  verificationDate: null,
  year: null,
};

const loadStateFromSession = (): DonationReceiptContextState => {
  try {
    const storedState = sessionStorage.getItem('donationReceiptContext');
    return storedState ? JSON.parse(storedState) : defaultState;
  } catch (error) {
    console.error('Failed to parse session storage:', error);
    sessionStorage.removeItem('donationReceiptContext');
    return defaultState;
  }
};

// Context interface
interface DonationReceiptContextInterface {
  email: string | null;
  getDonor: () => DonorView | null;
  getAddress: () => AddressView | null;
  getAddressGuid: () => string | null;
  getReceiptData: () => ReceiptData | null;
  getOperation: () => Operation;
  getDonationUids: () => string[];
  getVerificationDate: () => string | null;
  isValid: boolean;
  tinIsRequired: boolean;

  // context manipulation functions
  initForVerification: (data: IssuedReceiptDataApi, user: User | null) => void;
  initForIssuance: (
    data: UnissuedReceiptDataAPI,
    donor: DonorView,
    address: AddressView,
    addressGuid: string,
    user: User | null
  ) => void;
  updateDonorAndAddress: (
    donor: DonorView,
    address: AddressView,
    addressGuid: string,
    user: User | null
  ) => void;
  clearSessionStorage: () => void;
}

// Create context
const DonationReceiptContext =
  createContext<DonationReceiptContextInterface | null>(null);

// Provider component
export const DonationReceiptProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, setState] =
    useState<DonationReceiptContextState>(loadStateFromSession);
  // Persist state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('donationReceiptContext', JSON.stringify(state));
  }, [state]);

  //clean donation receipt data from the session storage
  const clearSessionStorage = (): void => {
    sessionStorage.removeItem('donationReceiptContext');
  };

  // Initialize context for verification
  const initForVerification = (
    data: IssuedReceiptDataApi,
    user: User | null
  ): void => {
    if (!data) return;

    const address = transformAddress(data.donor);
    const donations: DonationView[] =
      data.donations?.map((item: IssuedDonationApi) =>
        transformIssuedDonation(item)
      ) ?? [];
    const donor = transformDonor(data.donor);
    const isVerified = !!data.verificationDate;
    const operation = isVerified
      ? RECEIPT_STATUS.DOWNLOAD
      : RECEIPT_STATUS.VERIFY;
    const tinIsRequired = data.tinIsRequired ?? false;

    const isValid = validateIssuedReceipt(donor, address, tinIsRequired, user);

    const newState = {
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
      email: data.donor.email,
      dtn: data.dtn ?? null,
      isValid,
      isVerified,
      operation,
      paymentDate: data.paymentDate,
      tinIsRequired,
      type: null,
      verificationDate: data.verificationDate ?? null,
      year: data.year ?? null,
    };

    setState(newState);
  };

  // Initialize context for issuance
  const initForIssuance = (
    data: UnissuedReceiptDataAPI,
    donor: DonorView,
    address: AddressView,
    addressGuid: string,
    user: User | null
  ): void => {
    if (!data) return;

    const tinIsRequired = data.tinIsRequired ?? false;
    const isValid = validateUnissuedReceipt(
      donor,
      address,
      tinIsRequired,
      addressGuid,
      user
    );

    const donations: DonationView[] =
      data.donations?.map((item: UnissuedDonationApi) =>
        transformUnissuedDonation(item)
      ) ?? [];

    const newState = {
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
      email: null,
      isValid,
      isVerified: false,
      operation: RECEIPT_STATUS.ISSUE,
      paymentDate: data.paymentDate,
      tinIsRequired: data.tinIsRequired ?? false,
      type: data.type,
      verificationDate: null,
      year: null,
    };

    setState(newState);
  };

  // Update donor and address
  const updateDonorAndAddress = (
    donor: DonorView,
    address: AddressView,
    addressGuid: string,
    user: User | null
  ): void => {
    setState((prevState) => {
      let isValid = prevState.isValid;
      if (prevState.operation === RECEIPT_STATUS.ISSUE) {
        isValid = validateUnissuedReceipt(
          donor,
          address,
          prevState.tinIsRequired,
          addressGuid,
          user
        );
      } else {
        isValid = validateIssuedReceipt(
          donor,
          address,
          prevState.tinIsRequired,
          user
        );
      }
      return {
        ...prevState,
        donor,
        address,
        addressGuid,
        isValid,
      };
    });
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
      return donor !== null &&
        address !== null &&
        amount !== null &&
        currency !== null &&
        country !== null &&
        donations !== null &&
        donationCount !== null
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
    email: state.email,
    isValid: state.isValid,
    tinIsRequired: state.tinIsRequired,
    updateDonorAndAddress,
    clearSessionStorage,
  };

  return (
    <DonationReceiptContext.Provider value={contextValue}>
      {children}
    </DonationReceiptContext.Provider>
  );
};

// Hook to use the context
export const useDonationReceiptContext =
  (): DonationReceiptContextInterface => {
    const context = useContext(DonationReceiptContext);
    if (!context) {
      throw new Error(
        'useDonationReceiptContext must be used within a DonationReceiptProvider'
      );
    }
    return context;
  };
