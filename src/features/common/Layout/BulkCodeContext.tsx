import type { ReactNode } from 'react';
import type { SetState } from '../types/common';
import type { BulkCodeMethods } from '../../../utils/constants/bulkCodeConstants';
import type {
  CountryCode,
  CurrencyCode,
  CountryProject,
} from '@planet-sdk/common';

import { useContext, createContext, useMemo, useState } from 'react';

export interface PlanetCashAccount {
  guid: string;
  currency: CurrencyCode;
  country: CountryCode;
}

interface BulkGiftGenericData {
  comment?: string;
  quantity: number;
  value: number;
}

export interface Recipient {
  units: number;
  recipientName: string;
  recipientEmail: string;
  message: string;
  notifyRecipient: boolean;
  // occasion: string;
}

export interface BulkGiftImportData {
  comment?: string;
  occasion: string;
  recipients: Recipient[];
}

type BulkGiftData = BulkGiftGenericData | BulkGiftImportData;

interface BulkCodeContextInterface {
  bulkMethod: BulkCodeMethods | null;
  setBulkMethod: SetState<BulkCodeMethods | null>;
  planetCashAccount: PlanetCashAccount | null;
  setPlanetCashAccount: SetState<PlanetCashAccount | null>;
  project: CountryProject | null;
  setProject: SetState<CountryProject | null>;
  projectList: CountryProject[] | null;
  setProjectList: SetState<CountryProject[] | null>;
  bulkGiftData: BulkGiftData | null;
  setBulkGiftData: SetState<BulkGiftData | null>;
  totalUnits: number | null;
  setTotalUnits: SetState<number | null>;
}

const BulkCodeContext = createContext<BulkCodeContextInterface | null>(null);

export const BulkCodeProvider = ({ children }: { children: ReactNode }) => {
  const [bulkMethod, setBulkMethod] = useState<BulkCodeMethods | null>(null);
  const [planetCashAccount, setPlanetCashAccount] =
    useState<PlanetCashAccount | null>(null);
  const [project, setProject] = useState<CountryProject | null>(null);
  const [projectList, setProjectList] = useState<CountryProject[] | null>(null);
  const [bulkGiftData, setBulkGiftData] = useState<BulkGiftData | null>(null);
  const [totalUnits, setTotalUnits] = useState<number | null>(null);

  const value: BulkCodeContextInterface | null = useMemo(
    () => ({
      bulkMethod,
      setBulkMethod,
      planetCashAccount,
      setPlanetCashAccount,
      project,
      setProject,
      projectList,
      setProjectList,
      bulkGiftData,
      setBulkGiftData,
      totalUnits,
      setTotalUnits,
    }),
    [
      bulkMethod,
      setBulkMethod,
      planetCashAccount,
      setPlanetCashAccount,
      project,
      setProject,
      projectList,
      setProjectList,
      bulkGiftData,
      setBulkGiftData,
      totalUnits,
      setTotalUnits,
    ]
  );

  return (
    <BulkCodeContext.Provider value={value}>
      {children}
    </BulkCodeContext.Provider>
  );
};

export const useBulkCode = (): BulkCodeContextInterface => {
  const context = useContext(BulkCodeContext);
  if (!context) {
    throw new Error('BulkCodeContext must be used within BulkCodeProvider');
  }
  return context;
};
