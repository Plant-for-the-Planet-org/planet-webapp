import {
  useContext,
  createContext,
  useMemo,
  useState,
  FC,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
} from 'react';
import { getAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { BulkCodeMethods } from '../../../utils/constants/bulkCodeMethods';
import { ErrorHandlingContext } from './ErrorHandlingContext';
import { UserPropsContext } from './UserPropsContext';

interface PlanetCashAccount {
  guid: string;
  currency: string;
  country: string;
}

interface Project {
  guid: string;
  slug: string;
  unitCost: string;
  currency: string;
  unit: string;
  purpose: string;
}

interface BulkGiftGenericData {
  comment?: string;
  quantity: number;
  value: number;
}

interface BulkGiftImportData {
  comment?: string;
  occasion: string;
  recipients: {
    value: number;
    recipientName: string;
    recipientEmail: string;
    message: string;
    notifyRecipient: boolean;
  }[];
}

type BulkGiftData = BulkGiftGenericData | BulkGiftImportData;

export type SetState<T> = Dispatch<SetStateAction<T>>;

interface BulkCodeContextInterface {
  bulkMethod: BulkCodeMethods.GENERIC | BulkCodeMethods.IMPORT | null;
  setBulkMethod: SetState<
    BulkCodeMethods.GENERIC | BulkCodeMethods.IMPORT | null
  >;
  planetCashAccount: PlanetCashAccount | null;
  setPlanetCashAccount: SetState<PlanetCashAccount | null>;
  project: Project | null;
  setProject: SetState<Project | null>;
  bulkGiftData: BulkGiftData | null;
  setBulkGiftData: SetState<BulkGiftData | null>;
  totalUnits: number | null;
  setTotalUnits: SetState<number | null>;
}

const BulkCodeContext = createContext<BulkCodeContextInterface | null>(null);

export const BulkCodeProvider: FC = ({ children }) => {
  const { handleError } = useContext(ErrorHandlingContext);
  const { token, contextLoaded } = useContext(UserPropsContext);

  const [bulkMethod, setBulkMethod] = useState<
    BulkCodeMethods.GENERIC | BulkCodeMethods.IMPORT | null
  >(null);
  const [planetCashAccount, setPlanetCashAccount] =
    useState<PlanetCashAccount | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [bulkGiftData, setBulkGiftData] = useState<BulkGiftData | null>(null);
  const [totalUnits, setTotalUnits] = useState<number | null>(null);

  const fetchProfile = useCallback(async () => {
    if (contextLoaded && token) {
      try {
        const { planetCash } = await getAuthenticatedRequest(
          '/app/profile',
          token,
          {},
          handleError
        );

        if (planetCash) {
          setPlanetCashAccount({
            guid: planetCash.account,
            country: planetCash.country,
            currency: planetCash.currency,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [token, contextLoaded]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const value: BulkCodeContextInterface | null = useMemo(
    () => ({
      bulkMethod,
      setBulkMethod,
      planetCashAccount,
      setPlanetCashAccount,
      project,
      setProject,
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
