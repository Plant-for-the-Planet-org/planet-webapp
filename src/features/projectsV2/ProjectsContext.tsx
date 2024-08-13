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
  ConservationProjectConcise,
  ConservationProjectExtended,
  handleError,
  TreeProjectConcise,
  TreeProjectExtended,
} from '@planet-sdk/common';
import { useTenant } from '../common/Layout/TenantContext';
import { SetState } from '../common/types/common';

interface ProjectsState {
  projects: MapProject[] | null;
  singleProject:
    | TreeProjectConcise
    | ConservationProjectConcise
    | TreeProjectExtended
    | ConservationProjectExtended
    | null;
  setSingleProject: SetState<
    | TreeProjectConcise
    | ConservationProjectConcise
    | TreeProjectExtended
    | ConservationProjectExtended
    | null
  >;
  isLoading: boolean;
  isError: boolean;
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
  const [singleProject, setSingleProject] = useState<
    | TreeProjectConcise
    | ConservationProjectConcise
    | TreeProjectExtended
    | ConservationProjectExtended
    | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { setErrors } = useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();

  const locale = useLocale();

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
      singleProject,
      setSingleProject,
    }),
    [projects, isLoading, isError, singleProject]
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
