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
import {
  getAuthenticatedRequest,
  getRequest,
} from '../../../utils/apiRequests/api';
import { BulkCodeMethods } from '../../../utils/constants/bulkCodeConstants';
import { ErrorHandlingContext } from './ErrorHandlingContext';
import { UserPropsContext } from './UserPropsContext';
import { TENANT_ID } from '../../../utils/constants/environment';
import i18next from '../../../../i18n';

const { useTranslation } = i18next;

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
  bulkMethod: BulkCodeMethods.GENERIC | BulkCodeMethods.IMPORT | null;
  setBulkMethod: SetState<
    BulkCodeMethods.GENERIC | BulkCodeMethods.IMPORT | null
  >;
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
  const { handleError } = useContext(ErrorHandlingContext);
  const { token, contextLoaded } = useContext(UserPropsContext);
  const { i18n } = useTranslation();

  const [bulkMethod, setBulkMethod] = useState<
    BulkCodeMethods.GENERIC | BulkCodeMethods.IMPORT | null
  >(null);
  const [planetCashAccount, setPlanetCashAccount] =
    useState<PlanetCashAccount | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [projectList, setProjectList] = useState<Project[] | null>(null);
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

  const fetchProjectList = useCallback(async () => {
    if (planetCashAccount) {
      try {
        const fetchedProjects = await getRequest<
          [
            {
              properties: {
                id: string;
                name: string;
                slug: string;
                allowDonations: boolean;
                purpose: string;
                currency: string;
                unitCost: number;
              };
            }
          ]
        >(`/app/projects`, handleError, undefined, {
          _scope: 'map',
          currency: planetCashAccount.currency,
          tenant: TENANT_ID,
          'filter[purpose]': 'trees',
          locale: i18n.language,
        });

        // map fetchedProjects to desired form and setProject
        if (
          fetchedProjects &&
          Array.isArray(fetchedProjects) &&
          fetchedProjects.length > 0
        ) {
          setProjectList(
            // Filter projects which allow donations, and store only required values in context
            fetchedProjects
              .filter((project) => project.properties.allowDonations)
              .map((project) => {
                return {
                  guid: project.properties.id,
                  slug: project.properties.slug,
                  name: project.properties.name,
                  unitCost: project.properties.unitCost,
                  currency: project.properties.currency,
                  /* unit: 'trees', */
                  purpose: project.properties.purpose,
                  allowDonations: project.properties.allowDonations,
                };
              })
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [planetCashAccount]);

  useEffect(() => {
    fetchProjectList();
  }, [fetchProjectList]);

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
