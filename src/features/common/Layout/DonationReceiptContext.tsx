import type { FC } from 'react';
import type { Address, UserType } from '@planet-sdk/common';
import type { SetState } from '../types/common';

import { useMemo, useState, createContext, useContext } from 'react';

interface Donor {
  tin: string | null;
  name: string;
  type: UserType;
}

interface DonationReceiptItemView {
  amount: number;
  currency: string | null;
  paymentDate: string;
  reference: string;
}

interface DonationReceiptData {
  dtn: string | null;
  challenge: string | null;
  year: string | null;
  donor: Donor;
  address: Address;
  amount: number | null;
  currency: string | null;
  donations: DonationReceiptItemView[];
  operation?: string | null;
  donationUids?: string[];
  tinIsRequired?: boolean;
  mustAuthenticate?: boolean;
  verificationDate: string;
  isVerified?: boolean;
  isDirty?: boolean;
  downloadUrl?: string;
}

interface DonationReceiptContextInterface {
  donationReceiptData: DonationReceiptData | null;
  setDonationReceiptData: SetState<DonationReceiptData | null>;
}

const DonationReceiptContext =
  createContext<DonationReceiptContextInterface | null>(null);

export const DonationReceiptProvider: FC = ({ children }) => {
  const [donationReceiptData, setDonationReceiptData] =
    useState<DonationReceiptData | null>(null);

  const value: DonationReceiptContextInterface = useMemo(
    () => ({
      setDonationReceiptData,
      donationReceiptData,
    }),
    [setDonationReceiptData, donationReceiptData]
  );

  return (
    <DonationReceiptContext.Provider value={value}>
      {children}
    </DonationReceiptContext.Provider>
  );
};

export const useDonationReceipt = (): DonationReceiptContextInterface => {
  const context = useContext(DonationReceiptContext);
  if (!context)
    throw new Error(
      'DonationReceiptContext must be used within AnalyticsProvider'
    );
  return context;
};
