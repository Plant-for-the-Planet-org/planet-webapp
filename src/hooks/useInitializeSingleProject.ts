import type { ProjectSiteFeature } from '../features/common/types/map';

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  useInterventionStore,
  useSingleProjectStore,
  useViewStore,
} from '../stores';
import { useLocale } from 'next-intl';
import { FIRST_SITE_INDEX, isString } from '../utils/projectV2';

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
  const { site: requestedSite, ploc: requestedIntervention } = router.query;
  const hasOnlyRequestedIntervention = Boolean(
    !requestedSite && requestedIntervention
  );
  // store: state
  const currentPage = useViewStore((state) => state.page);
  const singleProject = useSingleProjectStore((state) => state.singleProject);
  const selectedSite = useSingleProjectStore((state) => state.selectedSite);
  const selectedIntervention = useInterventionStore(
    (state) => state.selectedIntervention
  );
  // store: action
  const selectSiteAndSyncUrl = useSingleProjectStore(
    (state) => state.selectSiteAndSyncUrl
  );
  const clearProjectStates = useSingleProjectStore(
    (state) => state.clearProjectStates
  );

  const projectSites = singleProject?.sites ?? [];
  const hasProjectSites = projectSites.length > 0;

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
