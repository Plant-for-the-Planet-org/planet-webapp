import {
  useContext,
  createContext,
  useMemo,
  useState,
  FC,
  Dispatch,
  SetStateAction,
} from 'react';
import { BulkCodeMethods } from '../../../utils/constants/bulkCodeConstants';
import { ProjectOption } from '../types/project';
import { CountryCode, CurrencyCode } from '@planet-sdk/common';

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

export type SetState<T> = Dispatch<SetStateAction<T>>;

interface BulkCodeContextInterface {
  bulkMethod: BulkCodeMethods | null;
  setBulkMethod: SetState<BulkCodeMethods | null>;
  planetCashAccount: PlanetCashAccount | null;
  setPlanetCashAccount: SetState<PlanetCashAccount | null>;
  project: ProjectOption | null;
  setProject: SetState<ProjectOption | null>;
  projectList: ProjectOption[] | null;
  setProjectList: SetState<ProjectOption[] | null>;
  bulkGiftData: BulkGiftData | null;
  setBulkGiftData: SetState<BulkGiftData | null>;
  totalUnits: number | null;
  setTotalUnits: SetState<number | null>;
}

const BulkCodeContext = createContext<BulkCodeContextInterface | null>(null);

export const BulkCodeProvider: FC = ({ children }) => {
  const [bulkMethod, setBulkMethod] = useState<BulkCodeMethods | null>(null);
  const [planetCashAccount, setPlanetCashAccount] =
    useState<PlanetCashAccount | null>(null);
  const [project, setProject] = useState<ProjectOption | null>(null);
  const [projectList, setProjectList] = useState<ProjectOption[] | null>(null);
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
