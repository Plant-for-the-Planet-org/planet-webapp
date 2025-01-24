import type { FC } from 'react';

import { useMemo, useState, createContext, useContext } from 'react';

export type Donor = {
  tin: string | null;
  city: string;
  name: string;
  type: 'individual' | 'organization';
  email: string;
  country: string;
  zipCode: string;
  address1: string;
  address2: string | null;
  reference: string;
};

export type Donation = {
  amount: number;
  currency: string;
  paymentDate: string;
  reference: string;
};

export type ReceiptData = {
  dtn: string;
  challenge: string;
  year: string;
  country: string;
  reference: string;
  amount: number;
  currency: string;
  paymentDate: string;
  verificationDate: string | null;
  donor: Donor;
  downloadUrl: string;
  donationCount: number;
  donations: Donation[];
};

interface DonationReceiptContextInterface {
  donationReceiptData: ReceiptData | null;
  updateDonationReceiptData: (data: Partial<ReceiptData>) => void;
}

const DonationReceiptContext =
  createContext<DonationReceiptContextInterface | null>(null);

export const DonationReceiptProvider: FC = ({ children }) => {
  const [donationReceiptData, setDonationReceiptData] =
    useState<ReceiptData | null>(null);
  const updateDonationReceiptData = (data: Partial<ReceiptData>) => {
    setDonationReceiptData((prevState) => {
      if (!prevState) {
        return { ...data } as ReceiptData;
      }
      return {
        ...prevState,
        ...data,
      } as ReceiptData;
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
