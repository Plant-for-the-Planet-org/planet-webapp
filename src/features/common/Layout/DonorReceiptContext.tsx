import type { FC } from 'react';

import { useMemo, useState, createContext, useContext } from 'react';
import { formatReceiptData } from '../../user/DonorReceipt/utils';

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

interface DonorReceiptContextInterface {
  donorReceiptData: ReceiptData | null;
  updateDonorReceiptData: (data: Partial<ReceiptDataAPI>) => void;
}

const DonorReceiptContext = createContext<DonorReceiptContextInterface | null>(
  null
);

export const DonorReceiptProvider: FC = ({ children }) => {
  const [donorReceiptData, setDonorReceiptData] = useState<ReceiptData | null>(
    null
  );

  const updateDonorReceiptData = (data: Partial<ReceiptDataAPI>) => {
    const formattedData = formatReceiptData(data);
    setDonorReceiptData((prevState) => ({
      ...prevState,
      ...formattedData,
    }));
  };

  const value: DonorReceiptContextInterface = useMemo(
    () => ({
      donorReceiptData,
      updateDonorReceiptData,
    }),
    [updateDonorReceiptData, donorReceiptData]
  );

  return (
    <DonorReceiptContext.Provider value={value}>
      {children}
    </DonorReceiptContext.Provider>
  );
};

export const useDonorReceipt = (): DonorReceiptContextInterface => {
  const context = useContext(DonorReceiptContext);
  if (!context)
    throw new Error(
      'DonorReceiptContext must be used within DonorReceiptProvider'
    );
  return context;
};
