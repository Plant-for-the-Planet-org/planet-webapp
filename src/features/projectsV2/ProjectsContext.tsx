import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { MapProject } from '../common/types/projectv2';
import { useLocale } from 'next-intl';
import getStoredCurrency from '../../utils/countryCurrency/getStoredCurrency';
import { getRequest } from '../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../common/Layout/ErrorHandlingContext';
import {
  APIError,
  handleError,
  TreeProjectClassification,
} from '@planet-sdk/common';
import { useTenant } from '../common/Layout/TenantContext';
import { SetState } from '../common/types/common';

interface ProjectsState {
  projects: MapProject[] | null;
  isLoading: boolean;
  isError: boolean;
  isMobile: boolean;
  topFilteredProjects: MapProject[] | null;
  setTopFilteredProjects: SetState<MapProject[] | null>;
  regularFilterProjects: MapProject[] | null;
  setRegularFilterProjects: SetState<MapProject[] | null>;
  debouncedSearchValue: string;
  setDebouncedSearchValue: SetState<string>;
  searchProjectResults: MapProject[] | null;
  setSearchProjectResults: SetState<MapProject[] | null>;
  tabSelected: number;
  setTabSelected: SetState<number>;
  topProjects: MapProject[] | undefined;
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
}

const ProjectsContext = createContext<ProjectsState | null>(null);

type ProjectsProviderProps = {
  page: 'project-list' | 'project-details';
  currencyCode: string;
  setCurrencyCode: SetState<string>;
};

export const ProjectsProvider: FC<ProjectsProviderProps> = ({
  children,
  page,
  currencyCode,
  setCurrencyCode,
}) => {
  const [projects, setProjects] = useState<MapProject[] | null>(null);
  const [topFilteredProjects, setTopFilteredProjects] = useState<
    MapProject[] | null
  >(null);
  const [regularFilterProjects, setRegularFilterProjects] = useState<
    MapProject[] | null
  >(null);
  const [tabSelected, setTabSelected] = useState(0);
  const [selectedClassification, setSelectedClassification] = useState<
    TreeProjectClassification[]
  >([]);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [searchProjectResults, setSearchProjectResults] = useState<
    MapProject[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 481);
  const { setErrors } = useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();

  const locale = useLocale();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 481);
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const topProjects = useMemo(
    () =>
      projects?.filter((projects) => {
        if (projects.properties.purpose === 'trees')
          return projects.properties.isTopProject === true;
      }),
    [projects, tabSelected]
  );

  useEffect(() => {
    async function loadProjects() {
      if (page !== 'project-list' || !currencyCode) {
        return;
      }

      setIsLoading(true);
      setIsError(false);

      try {
        const fetchedProjects = await getRequest<MapProject[]>(
          tenantConfig.id,
          `/app/projects`,
          {
            _scope: 'map',
            currency: currencyCode,
            tenant: tenantConfig.id,
            'filter[purpose]': 'trees,conservation',
            locale: locale,
          }
        );
        setProjects(fetchedProjects);
      } catch (err) {
        setErrors(handleError(err as APIError));
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, [currencyCode, locale, page]);

  useEffect(() => {
    if (!currencyCode) {
      const currency = getStoredCurrency();
      setCurrencyCode(currency);
    }
  }, [currencyCode, setCurrencyCode]);

  const value: ProjectsState | null = useMemo(
    () => ({
      projects,
      isLoading,
      isError,
      isMobile,
      topFilteredProjects,
      setTopFilteredProjects,
      regularFilterProjects,
      setRegularFilterProjects,
      debouncedSearchValue,
      setDebouncedSearchValue,
      searchProjectResults,
      setSearchProjectResults,
      topProjects,
      tabSelected,
      setTabSelected,
      selectedClassification,
      setSelectedClassification,
    }),
    [
      projects,
      isLoading,
      isError,
      isMobile,
      topFilteredProjects,
      regularFilterProjects,
      debouncedSearchValue,
      searchProjectResults,
      topProjects,
      tabSelected,
      selectedClassification,
    ]
  );

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsState => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('ProjectsContext must be used within ProjectsProvider');
  }
  return context;
};
