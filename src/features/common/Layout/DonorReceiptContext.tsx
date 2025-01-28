import type { FC } from 'react';
import type {
  ReceiptData,
  ReceiptDataAPI,
} from '../../user/DonorReceipt/donorReceipt';

import { useMemo, useState, createContext, useContext } from 'react';
import { formatReceiptData } from '../../user/DonorReceipt/utils';

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
