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

export interface PlanetCashAccount {
  guid: string;
  currency: string;
  country: string;
}

export interface Project {
  guid: string;
  slug: string;
  name: string;
  unitCost: number;
  currency: string;
  unit?: string;
  purpose: string;
  allowDonations: boolean;
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
  project: Project | null;
  setProject: SetState<Project | null>;
  projectList: Project[] | null;
  setProjectList: SetState<Project[] | null>;
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
  const [project, setProject] = useState<Project | null>(null);
  const [projectList, setProjectList] = useState<Project[] | null>(null);
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
