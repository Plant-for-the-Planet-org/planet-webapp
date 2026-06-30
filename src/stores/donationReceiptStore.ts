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
} from '../features/user/DonationReceipt/donationReceiptTypes';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { RECEIPT_STATUS } from '../features/user/DonationReceipt/donationReceiptTypes';
import {
  transformAddress,
  transformDonor,
  transformIssuedDonation,
  transformUnissuedDonation,
} from '../features/user/DonationReceipt/transformers';
import {
  validateIssuedReceipt,
  validateUnissuedReceipt,
} from '../features/user/DonationReceipt/DonationReceiptValidator';

const SESSION_STORAGE_KEY = 'donationReceiptContext';

// Serializable state persisted to sessionStorage
interface DonationReceiptState {
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

interface DonationReceiptStore extends DonationReceiptState {
  // getters (imperative reads for event handlers)
  getDonor: () => DonorView | null;
  getAddress: () => AddressView | null;
  getAddressGuid: () => string | null;
  getDonationUids: () => string[];

  // actions
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
  initializeFromSession: () => void;
}

// Default state
const defaultState: DonationReceiptState = {
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

// Extract only the serializable data slice (excludes action functions)
const getDataState = (state: DonationReceiptStore): DonationReceiptState => ({
  address: state.address,
  addressGuid: state.addressGuid,
  amount: state.amount,
  challenge: state.challenge,
  country: state.country,
  currency: state.currency,
  donationCount: state.donationCount,
  donationUids: state.donationUids,
  donations: state.donations,
  donor: state.donor,
  downloadUrl: state.downloadUrl,
  dtn: state.dtn,
  email: state.email,
  isValid: state.isValid,
  isVerified: state.isVerified,
  operation: state.operation,
  paymentDate: state.paymentDate,
  tinIsRequired: state.tinIsRequired,
  type: state.type,
  verificationDate: state.verificationDate,
  year: state.year,
});

// Persist the entire state to sessionStorage (mirrors the provider's effect)
const persistState = (state: DonationReceiptStore): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify(getDataState(state))
  );
};

export const useDonationReceiptStore = create<DonationReceiptStore>()(
  devtools(
    (set, get) => ({
      //state
      ...defaultState,

      //getters
      getDonor: () => get().donor,
      getAddress: () => get().address,
      getAddressGuid: () => get().addressGuid,
      getDonationUids: () => get().donationUids,

      //actions
      // Initialize state for verification
      initForVerification: (data, user) => {
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

        const isValid = validateIssuedReceipt(
          donor,
          address,
          tinIsRequired,
          user
        );

        const newState: DonationReceiptState = {
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

        set(newState, undefined, 'donationReceipt/init_for_verification');
        persistState(get());
      },

      // Initialize state for issuance
      initForIssuance: (data, donor, address, addressGuid, user) => {
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

        const newState: DonationReceiptState = {
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

        set(newState, undefined, 'donationReceipt/init_for_issuance');
        persistState(get());
      },

      // Update donor and address
      updateDonorAndAddress: (donor, address, addressGuid, user) => {
        const prevState = get();
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

        set(
          { donor, address, addressGuid, isValid },
          undefined,
          'donationReceipt/update_donor_and_address'
        );
        persistState(get());
      },

      // Clear donation receipt data from sessionStorage (in-memory state is preserved)
      clearSessionStorage: () => {
        if (typeof window === 'undefined') return;
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      },

      // Hydrate state from sessionStorage on app startup
      initializeFromSession: () => {
        if (typeof window === 'undefined') return;
        try {
          const storedState = sessionStorage.getItem(SESSION_STORAGE_KEY);
          if (storedState) {
            set(
              JSON.parse(storedState) as DonationReceiptState,
              undefined,
              'donationReceipt/init_from_session'
            );
          }
        } catch (error) {
          console.error('Failed to parse session storage:', error);
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      },
    }),
    {
      name: 'DonationReceiptStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);

// Derived selectors (use with the store hook to stay reactive)
export const selectReceiptData = (
  state: DonationReceiptStore
): ReceiptData | null => {
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
    type,
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
        paymentDate,
        type,
        year,
      }
    : null;
};

export const selectOperation = (state: DonationReceiptStore): Operation => {
  const operation = state.operation;
  return Object.values(RECEIPT_STATUS).includes(operation as Operation)
    ? (operation as Operation)
    : RECEIPT_STATUS.VERIFY;
};
