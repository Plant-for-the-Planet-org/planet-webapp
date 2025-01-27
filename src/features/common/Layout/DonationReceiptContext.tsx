import type { FC } from 'react';

import { useMemo, useState, createContext, useContext } from 'react';
import { formatReceiptData } from '../../user/DonationReceipt/utils';

export type IssuedDonationView = {
  amount: number;
  currency: string;
  paymentDate: string;
  reference: string;
};

export type DonorAPI = {
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

export type DonorView = {
  tin: string | null;
  name: string;
  type: 'individual' | 'organization' | null;
};

export type AddressView = {
  city: string;
  country: string;
  zipCode: string;
  address1: string;
  address2: string | null;
};

type ReceiptDataBase = {
  dtn: string;
  year: string;
  challenge: string;
  amount: number;
  currency: string;
  paymentDate: string;
  verificationDate: string | null;
  downloadUrl: string;
  donationCount: number;
};

export interface ReceiptDataAPI extends ReceiptDataBase {
  country: string;
  reference: string;
  donor: DonorAPI;
  donations: IssuedDonationView[];
}
export interface ReceiptData extends ReceiptDataBase {
  operation: 'verify' | 'download';
  donor: DonorView;
  address: AddressView;
  issuedDonations: IssuedDonationView[] | null;
  hasDonorDataChanged: boolean; // Set it to true if the user modifies the data during the receipt verification process
}

interface DonationReceiptContextInterface {
  donationReceiptData: ReceiptData | null;
  updateDonationReceiptData: (data: Partial<ReceiptDataAPI>) => void;
}

const DonationReceiptContext =
  createContext<DonationReceiptContextInterface | null>(null);

export const DonationReceiptProvider: FC = ({ children }) => {
  const [donationReceiptData, setDonationReceiptData] =
    useState<ReceiptData | null>(null);

  const updateDonationReceiptData = (data: Partial<ReceiptDataAPI>) => {
    const formattedData = formatReceiptData(data);
    setDonationReceiptData((prevState) => ({
      ...prevState,
      ...formattedData,
    }));
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
