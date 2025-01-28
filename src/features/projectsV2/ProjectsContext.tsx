import type { FC } from 'react';
import type { ExtendedProject, MapProject } from '../common/types/projectv2';
import type {
  APIError,
  CountryCode,
  TreeProjectClassification,
} from '@planet-sdk/common';
import type { SetState } from '../common/types/common';
import type { ViewMode } from '../common/Layout/ProjectsLayout/MobileProjectsLayout';
import type {
  PlantLocation,
  SamplePlantLocation,
} from '../common/types/plantLocation';
import type { INTERVENTION_TYPE } from '../../utils/constants/intervention';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/router';
import { handleError } from '@planet-sdk/common';
import getStoredCurrency from '../../utils/countryCurrency/getStoredCurrency';
import { getRequest } from '../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../common/Layout/ErrorHandlingContext';
import { useTenant } from '../common/Layout/TenantContext';
import { buildProjectDetailsQuery } from '../../utils/projectV2';

interface ProjectsState {
  projects: MapProject[] | null;
  singleProject: ExtendedProject | null;
  setSingleProject: SetState<ExtendedProject | null>;
  plantLocations: PlantLocation[] | null;
  setPlantLocations: SetState<PlantLocation[] | null>;
  selectedPlantLocation: PlantLocation | null;
  setSelectedPlantLocation: SetState<PlantLocation | null>;
  selectedSamplePlantLocation: SamplePlantLocation | null;
  setSelectedSamplePlantLocation: SetState<SamplePlantLocation | null>;
  hoveredPlantLocation: PlantLocation | null;
  setHoveredPlantLocation: SetState<PlantLocation | null>;
  selectedSite: number | null;
  setSelectedSite: SetState<number | null>;
  setPreventShallowPush: SetState<boolean>;
  isLoading: boolean;
  setIsLoading: SetState<boolean>;
  isError: boolean;
  setIsError: SetState<boolean>;
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  debouncedSearchValue: string;
  setDebouncedSearchValue: SetState<string>;
  isSearching: boolean;
  setIsSearching: SetState<boolean>;
  filteredProjects: MapProject[] | undefined;
  topProjects: MapProject[] | undefined;
  selectedMode?: ViewMode;
  setSelectedMode?: SetState<ViewMode>;
  selectedInterventionType: INTERVENTION_TYPE;
  setSelectedInterventionType: SetState<INTERVENTION_TYPE>;
  disableInterventionMenu: boolean;
  setDisableInterventionMenu: SetState<boolean>;
}

const ProjectsContext = createContext<ProjectsState | null>(null);

type ProjectsProviderProps = {
  page?: 'project-list' | 'project-details';
  currencyCode?: string;
  setCurrencyCode?: SetState<string> | undefined;
  selectedMode?: ViewMode;
  setSelectedMode?: SetState<ViewMode>;
};

export const ProjectsProvider: FC<ProjectsProviderProps> = ({
  children,
  page,
  currencyCode,
  setCurrencyCode,
  selectedMode,
  setSelectedMode,
}) => {
  const [projects, setProjects] = useState<MapProject[] | null>(null);
  const [singleProject, setSingleProject] = useState<ExtendedProject | null>(
    null
  );
  const [plantLocations, setPlantLocations] = useState<PlantLocation[] | null>(
    null
  );
  const [selectedPlantLocation, setSelectedPlantLocation] =
    useState<PlantLocation | null>(null);
  const [selectedSamplePlantLocation, setSelectedSamplePlantLocation] =
    useState<SamplePlantLocation | null>(null);
  const [hoveredPlantLocation, setHoveredPlantLocation] =
    useState<PlantLocation | null>(null);
  const [selectedSite, setSelectedSite] = useState<number | null>(null);
  const [selectedInterventionType, setSelectedInterventionType] =
    useState<INTERVENTION_TYPE>('all');
  const [disableInterventionMenu, setDisableInterventionMenu] = useState(false);
  const [preventShallowPush, setPreventShallowPush] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState<
    TreeProjectClassification[]
  >([]);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [projectsLocale, setProjectsLocale] = useState('');
  const { setErrors } = useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const locale = useLocale();
  const tCountry = useTranslations('Country');
  const router = useRouter();
  const { ploc: requestedPlantLocation, site: requestedSite } = router.query;

  //* Function to filter projects based on classification
  const filterByClassification = useCallback(
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
    [projects]
  );

  const getSearchProjects = useCallback(
    (projects: MapProject[] | null, keyword: string) => {
      if (!keyword?.trim()) {
        return [];
      }

      const normalizedKeyword = keyword
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      const filteredProjects = projects?.filter((project: MapProject) => {
        const normalizedText = (text: string | undefined | null) => {
          return text
            ? text
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
            : '';
        };

        const projectName = normalizedText(project.properties.name);
        const projectLocation =
          project.properties.purpose === 'trees'
            ? normalizedText(project.properties.location)
            : '';
        const tpoName = normalizedText(project.properties.tpo.name);
        const country = normalizedText(
          tCountry(
            project.properties.country.toLowerCase() as Lowercase<CountryCode>
          )
        );
        return (
          projectName.includes(normalizedKeyword) ||
          projectLocation.includes(normalizedKeyword) ||
          tpoName.includes(normalizedKeyword) ||
          country.includes(normalizedKeyword)
        );
      });
      return filteredProjects;
    },
    [locale]
  );

  const filteredProjects = useMemo(() => {
    let result = projects || [];

    if (selectedClassification?.length > 0)
      result = filterByClassification(result);

    if (debouncedSearchValue)
      result = getSearchProjects(result, debouncedSearchValue) || result;

    return result;
  }, [projects, selectedClassification, debouncedSearchValue]);

  useEffect(() => {
    async function loadProjects() {
      if (page !== 'project-list' || !currencyCode) return;
      if (projectsLocale === locale && projects !== null) return;

      setIsLoading(true);
      setIsError(false);
      try {
        const fetchedProjects = await getRequest<MapProject[]>({
          tenant: tenantConfig.id,
          url: `/app/projects`,
          queryParams: {
            _scope: 'map',
            currency: currencyCode,
            tenant: tenantConfig.id,
            'filter[purpose]': 'trees,conservation',
            locale: locale,
          },
        });
        setProjects(fetchedProjects);
        setProjectsLocale(locale);
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
    if (!currencyCode && setCurrencyCode !== undefined) {
      const currency = getStoredCurrency();
      setCurrencyCode(currency);
    }
  }, [currencyCode, setCurrencyCode]);

  useEffect(() => {
    setDebouncedSearchValue('');
    if (page === 'project-details') {
      if (setSelectedMode) setSelectedMode('list');
      setIsSearching(false);
      setSelectedClassification([]);
    } else {
      setSelectedPlantLocation(null);
      setSingleProject(null);
      setHoveredPlantLocation(null);
      setSelectedSite(null);
      setSelectedInterventionType('all');
      setDisableInterventionMenu(false);
      setPreventShallowPush(false);
      setPlantLocations(null);
    }
    if (selectedMode === 'list' && page === 'project-list')
      setPlantLocations(null);
  }, [page]);

  const updateProjectDetailsPath = (
    locale: string,
    projectSlug: string,
    queryParams: Record<string, string> = {}
  ) => {
    const pathname = `/${locale}/${projectSlug}`;

    // Extract only the visible query params for the URL
    const { locale: _, slug: __, p: ___, ...visibleParams } = queryParams;

    router?.push(
      {
        pathname,
        query: queryParams,
      },
      // Only show necessary params in the URL
      `${pathname}${
        Object.keys(visibleParams).length
          ? '?' + new URLSearchParams(visibleParams).toString()
          : ''
      }`,
      { shallow: true }
    );
  };

  const updateUrlWithSiteId = (
    locale: string,
    projectSlug: string,
    siteId: string | null
  ) => {
    const updatedQueryParams = buildProjectDetailsQuery(
      router.asPath,
      router.query,
      { siteId }
    );
    updateProjectDetailsPath(locale, projectSlug, updatedQueryParams);
  };

  const updateSiteAndUrl = (
    locale: string,
    projectSlug: string,
    siteIndex: number | undefined
  ) => {
    if (
      singleProject?.sites &&
      singleProject.sites.length > 0 &&
      siteIndex !== undefined
    ) {
      const siteId = singleProject.sites[siteIndex]?.properties.id;
      setSelectedSite(siteIndex);
      updateUrlWithSiteId(locale, projectSlug, siteId);
    } else {
      setSelectedSite(null);
      updateUrlWithSiteId(locale, projectSlug, null);
    }
  };

  const hasNoSites = useMemo(
    () =>
      singleProject?.sites?.length === 0 ||
      singleProject?.sites?.every((site) => site.geometry === null),
    [singleProject?.sites]
  );

  useEffect(() => {
    if (
      !router.isReady ||
      (plantLocations && plantLocations?.length === 0) ||
      page !== 'project-details' ||
      singleProject === null ||
      selectedSite !== null ||
      (requestedPlantLocation && requestedSite)
    )
      return;

    if (requestedPlantLocation && selectedPlantLocation === null) {
      if (hasNoSites) {
        //Case when a direct link requests a specific plant location but no sites exist for a project(e.g projectSlug: mothersforest).
        updateSiteAndUrl(locale, singleProject.slug, undefined);
      } else {
        // Handle the case where a direct link requests a specific plant location (via URL query).
        // This will update the ploc param based on the requestedPlantLocation. If the requested hid is invalid,
        // it falls back to the default (first) site.
        const result = plantLocations?.find(
          (plantLocation) => plantLocation.hid === requestedPlantLocation
        );
        result
          ? setSelectedPlantLocation(result)
          : updateSiteAndUrl(locale, singleProject.slug, 0);
      }
    }

    // Handles updating the URL with the 'ploc' parameter when a user selects a different plant location.
    if (selectedPlantLocation) {
      const updatedQueryParams = buildProjectDetailsQuery(
        router.asPath,
        router.query,
        { plocId: selectedPlantLocation.hid }
      );
      updateProjectDetailsPath(locale, singleProject.slug, updatedQueryParams);
    }
  }, [
    page,
    singleProject?.slug,
    locale,
    requestedPlantLocation,
    router.isReady,
    selectedPlantLocation,
    selectedSite,
    hasNoSites,
  ]);
  useEffect(() => {
    if (
      !router.isReady ||
      page !== 'project-details' ||
      singleProject === null ||
      selectedPlantLocation !== null ||
      preventShallowPush
    )
      return;
    // Handle the case where a direct link requests a specific site (via URL query)
    // This will update the site param based on the requestedSite. If the requested site ID is invalid,
    // it falls back to the default (first) site.
    if (requestedSite && selectedSite === null && !hasNoSites) {
      const index = singleProject.sites?.findIndex(
        (site) => site.properties.id === requestedSite
      );

      if (index !== undefined) {
        updateSiteAndUrl(locale, singleProject.slug, index !== -1 ? index : 0);
        return;
      }
    }

    // Handle the case where user manually selects a site from the site list on the project detail page
    if (selectedSite !== null) {
      updateSiteAndUrl(locale, singleProject.slug, selectedSite);
      return;
    }

    // If the user navigates to the project detail page from the project list (no specific site selected)
    // This defaults to the first site and updates the URL accordingly.
    if (!requestedPlantLocation) {
      const siteIndex = hasNoSites ? undefined : 0;
      updateSiteAndUrl(locale, singleProject.slug, siteIndex);
    }
  }, [
    page,
    locale,
    singleProject?.slug,
    selectedSite,
    singleProject?.sites,
    requestedSite,
    router.isReady,
    selectedPlantLocation,
    preventShallowPush,
    hasNoSites,
  ]);

  useEffect(() => {
    if (selectedMode === 'list' && singleProject !== null) {
      setSelectedSamplePlantLocation(null);
      setSelectedPlantLocation(null);
      setHoveredPlantLocation(null);
      updateSiteAndUrl(locale, singleProject.slug, hasNoSites ? undefined : 0);
    }
  }, [selectedMode, singleProject, locale, hasNoSites]);

  const value: ProjectsState | null = useMemo(
    () => ({
      projects,
      isLoading,
      setIsLoading,
      isError,
      setIsError,
      filteredProjects,
      debouncedSearchValue,
      setDebouncedSearchValue,
      isSearching,
      setIsSearching,
      topProjects,
      selectedClassification,
      setSelectedClassification,
      selectedMode,
      setSelectedMode,
      singleProject,
      setSingleProject,
      plantLocations,
      setPlantLocations,
      selectedPlantLocation,
      setSelectedPlantLocation,
      hoveredPlantLocation,
      setHoveredPlantLocation,
      selectedSamplePlantLocation,
      setSelectedSamplePlantLocation,
      selectedSite,
      setSelectedSite,
      selectedInterventionType,
      disableInterventionMenu,
      setSelectedInterventionType,
      setDisableInterventionMenu,
      setPreventShallowPush,
    }),
    [
      projects,
      isLoading,
      isError,
      filteredProjects,
      isSearching,
      topProjects,
      selectedClassification,
      debouncedSearchValue,
      selectedMode,
      singleProject,
      plantLocations,
      selectedPlantLocation,
      selectedSamplePlantLocation,
      hoveredPlantLocation,
      selectedSite,
      preventShallowPush,
      selectedInterventionType,
      disableInterventionMenu,
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
