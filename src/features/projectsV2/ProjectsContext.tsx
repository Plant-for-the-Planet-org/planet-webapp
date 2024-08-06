import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
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
import { getSearchProjects } from './ProjectListControls/utils';

const MOBILE_BREAKPOINT = 481;
const TAB_OPTIONS = {
  TOP_PROJECTS: 'topProjects',
  ALL_PROJECTS: 'allProjects',
} as const;

interface ProjectsState {
  projects: MapProject[] | null;
  isLoading: boolean;
  isError: boolean;
  isMobile: boolean;
  topFilteredProjects: MapProject[] | null;
  setTopFilteredProjects: SetState<MapProject[] | null>;
  regularFilterProjects: MapProject[] | null;
  setRegularFilterProjects: SetState<MapProject[] | null>;
  searchProjectResults: MapProject[] | null;
  setSearchProjectResults: SetState<MapProject[] | null>;
  tabSelected: number | 'topProjects' | 'allProjects';
  setTabSelected: SetState<number | 'topProjects' | 'allProjects'>;
  topProjects: MapProject[] | undefined;
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  debouncedSearchValue: string;
  setDebouncedSearchValue: SetState<string>;
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
  const [tabSelected, setTabSelected] = useState<
    number | (typeof TAB_OPTIONS)[keyof typeof TAB_OPTIONS]
  >(window.innerWidth < MOBILE_BREAKPOINT ? TAB_OPTIONS.TOP_PROJECTS : 0);
  const [selectedClassification, setSelectedClassification] = useState<
    TreeProjectClassification[]
  >([]);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [searchProjectResults, setSearchProjectResults] = useState<
    MapProject[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT
  );
  const { setErrors } = useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const locale = useLocale();

  // Function to filter projects based on classification
  const filterProjectsByClassification = useCallback(
    (projects: MapProject[]) => {
      if (selectedClassification.length === 0) return projects;
      return projects.filter((project) => {
        if (project.properties.purpose === 'trees')
          return selectedClassification.includes(
            project.properties.classification
          );
      });
    },
    [selectedClassification]
  );

  const topProjects = useMemo(
    () =>
      projects?.filter((projects) => {
        if (projects.properties.purpose === 'trees')
          return projects.properties.isTopProject === true;
      }),
    [projects, tabSelected]
  );
  useEffect(() => {
    if (topProjects && projects) {
      setTopFilteredProjects(filterProjectsByClassification(topProjects));
      setRegularFilterProjects(filterProjectsByClassification(projects));
    }
  }, [tabSelected, selectedClassification]);

  useEffect(() => {
    const searchResult = getSearchProjects(projects, debouncedSearchValue);
    if (searchResult) setSearchProjectResults(searchResult);
  }, [debouncedSearchValue]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      searchProjectResults,
      setSearchProjectResults,
      debouncedSearchValue,
      setDebouncedSearchValue,
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
      searchProjectResults,
      debouncedSearchValue,
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
