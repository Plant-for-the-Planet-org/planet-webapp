import type { FC } from 'react';
import type {
  ReceiptData,
  ReceiptDataAPI,
} from '../../user/DonationReceipt/donationReceiptTypes';

import { useMemo, useState, createContext, useContext } from 'react';
import { formatReceiptData } from '../../user/DonationReceipt/utils';

interface DonationReceiptContextInterface {
  donationReceiptData: ReceiptData | undefined;
  updateDonationReceiptData: (data: Partial<ReceiptDataAPI>) => void;
}

const DonationReceiptContext =
  createContext<DonationReceiptContextInterface | null>(null);

export const DonationReceiptProvider: FC = ({ children }) => {
  const [donationReceiptData, setDonationReceiptData] = useState<
    ReceiptData | undefined
  >();

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
