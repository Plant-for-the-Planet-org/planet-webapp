import type { FC } from 'react';
import type { Address, UserType } from '@planet-sdk/common';

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

export interface DonationReceiptData {
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
  updateDonationReceiptData: (data: Partial<DonationReceiptData>) => void;
}

const DonationReceiptContext =
  createContext<DonationReceiptContextInterface | null>(null);

export const DonationReceiptProvider: FC = ({ children }) => {
  const [donationReceiptData, setDonationReceiptData] =
    useState<DonationReceiptData | null>(null);

  const updateDonationReceiptData = (data: Partial<DonationReceiptData>) => {
    setDonationReceiptData((prevState) => {
      if (!prevState) {
        return { ...data } as DonationReceiptData;
      }
      return {
        ...prevState,
        ...data,
      } as DonationReceiptData;
    });
  };

  const value: DonationReceiptContextInterface = useMemo(
    () => ({
      donationReceiptData,
      updateDonationReceiptData,
    }),
    [updateDonationReceiptData, donationReceiptData]
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
      'DonationReceiptContext must be used within DonationReceiptProvider'
    );
  return context;
};
