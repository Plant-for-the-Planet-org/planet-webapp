import type { ProjectSiteFeature } from '../features/common/types/map';

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  useCurrencyStore,
  useInterventionStore,
  useSingleProjectStore,
  useTenantStore,
  useViewStore,
} from '../stores';
import { useLocale } from 'next-intl';
import { FIRST_SITE_INDEX, hasNoSites, isString } from '../utils/projectV2';
import { useApi } from './useApi';
import useLocalizedPath from './useLocalizedPath';

const getSiteIndexById = (
  sites: ProjectSiteFeature[],
  siteId: string | null
): number => {
  if (!siteId || !sites || sites.length === 0) return -1;

  return sites.findIndex((site) => site.properties.id === siteId);
};

export const useInitializeSingleProject = () => {
  const locale = useLocale();
  const router = useRouter();
  const { getApi } = useApi();
  const { localizedPath } = useLocalizedPath();
  const {
    p: projectSlug,
    site: requestedSite,
    ploc: requestedIntervention,
  } = router.query;
  const hasOnlyRequestedIntervention = Boolean(
    !requestedSite && requestedIntervention
  );
  // store: state
  const currentPage = useViewStore((state) => state.page);
  const currencyCode = useCurrencyStore((state) => state.currencyCode);
  const isCurrencyResolved = useCurrencyStore(
    (state) => state.isCurrencyResolved
  );
  const tenantId = useTenantStore((state) => state.tenantConfig.id);
  const singleProject = useSingleProjectStore((state) => state.singleProject);
  const selectedSite = useSingleProjectStore((state) => state.selectedSite);
  const fetchError = useSingleProjectStore((state) => state.fetchError);
  const selectedIntervention = useInterventionStore(
    (state) => state.selectedIntervention
  );
  // store: action
  const fetchProject = useSingleProjectStore((state) => state.fetchProject);
  const selectSiteAndSyncUrl = useSingleProjectStore(
    (state) => state.selectSiteAndSyncUrl
  );
  const clearProjectStates = useSingleProjectStore(
    (state) => state.clearProjectStates
  );

  /**
   * Fetch the project whenever the URL names one.
   *
   * This lives here rather than in `ProjectDetails` because that component is
   * not rendered when the details pane is hidden (`embed=true` with
   * `project_details=false`), which used to leave the map, interventions and
   * time travel config with no data at all.
   *
   * `router.query.p` is used as the signal rather than `viewStore.page`, since
   * the page is derived from that same param but only after an effect, and this
   * fetch should not wait on it.
   *
   * It does wait on `isCurrencyResolved`, because `currencyCode` starts at a
   * placeholder that would otherwise be fetched with and then immediately
   * superseded. Waiting here cannot stall: it resolves either immediately from
   * a stored value, or once `storeConfig`'s geo lookup settles (success or
   * failure), which always runs when this hook does.
   */
  useEffect(() => {
    if (!router.isReady) return;
    if (!isString(projectSlug)) return;
    if (!isCurrencyResolved || !currencyCode) return;

    fetchProject(
      getApi,
      {
        queryParams: {
          _scope: 'extended',
          currency: currencyCode,
          //passing locale/tenant as a query param to break cache when locale changes,
          //as the browser uses the cached response even though the x-locale header is different
          locale,
          tenant: tenantId,
        },
      },
      projectSlug
    );
  }, [
    router.isReady,
    projectSlug,
    locale,
    currencyCode,
    isCurrencyResolved,
    tenantId,
  ]);

  // Redirect home if the project fails to load. The store handles the error message, and this prevents an endless loading state.
  useEffect(() => {
    if (fetchError) {
      router.push(localizedPath('/'));
    }
  }, [fetchError]);

  const projectSites = singleProject?.sites ?? [];
  // A project has no sites if all site geometries are null.
  const hasProjectSites = !hasNoSites(projectSites);

  /**
   * Initialize site selection for project details page.
   * Selects a site only when:
   * - Router is ready
   * - We are on project-details
   * - No site or intervention is already selected
   * - URL does not explicitly request an intervention
   */
  useEffect(() => {
    if (!router.isReady) return;
    if (currentPage === 'project-list') return;
    if (!singleProject) return;
    if (selectedIntervention !== null) return;
    if (selectedSite !== null) return;
    if (hasOnlyRequestedIntervention) return;

    let siteIndex: number | null = null;
    // If site is provided in the URL, try to resolve it
    if (isString(requestedSite) && hasProjectSites) {
      const index = getSiteIndexById(projectSites, requestedSite);
      siteIndex = index !== -1 ? index : FIRST_SITE_INDEX;
    } else {
      // Default to first site (or null if no sites exist)
      siteIndex = hasProjectSites ? FIRST_SITE_INDEX : null;
    }

    selectSiteAndSyncUrl(siteIndex, locale, router);
  }, [
    router.isReady,
    currentPage,
    singleProject,
    selectedIntervention,
    selectedSite,
  ]);

  // Clear single-project state when navigating back to the project list.
  useEffect(() => {
    if (currentPage === 'project-list') clearProjectStates();
  }, [currentPage]);
};
