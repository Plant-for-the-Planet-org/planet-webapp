import type { FC } from 'react';
import type {
  ReceiptData,
  VerifiedReceiptDataAPI,
} from '../../user/DonationReceipt/donationReceipt';
import type { SetState } from '../types/common';

import { useMemo, useState, createContext, useContext } from 'react';
import { formatReceiptData } from '../../user/DonationReceipt/utils';

interface DonationReceiptContextInterface {
  donationReceiptData: ReceiptData | undefined;
  setDonationReceiptData: SetState<ReceiptData | undefined>;
  updateDonationReceiptData: (data: Partial<VerifiedReceiptDataAPI>) => void;
}

const DonationReceiptContext =
  createContext<DonationReceiptContextInterface | null>(null);

export const DonationReceiptProvider: FC = ({ children }) => {
  const [donationReceiptData, setDonationReceiptData] = useState<
    ReceiptData | undefined
  >();

  const updateDonationReceiptData = (data: Partial<VerifiedReceiptDataAPI>) => {
    const formattedData = formatReceiptData(data);
    setDonationReceiptData((prevState) => ({
      ...prevState,
      ...formattedData,
    }));
  };

  const value: DonationReceiptContextInterface = useMemo(
    () => ({
      donationReceiptData,
      setDonationReceiptData,
      updateDonationReceiptData,
    }),
    [updateDonationReceiptData, donationReceiptData, setDonationReceiptData]
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
