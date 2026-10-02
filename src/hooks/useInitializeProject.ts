import { useLocale } from 'next-intl';
import { useEffect } from 'react';
import { useProjectStore } from '../stores';
import { useApi } from './useApi';
import { useCurrencyStore, useTenantStore } from '../stores';
import { useRouter } from 'next/router';
import { isValidClassification } from '../utils/projectV2';
import { useCurrentPage } from './useCurrentPage';

export const useInitializeProject = () => {
  const locale = useLocale();
  const tenantId = useTenantStore((state) => state.tenantConfig.id);
  const { getApi } = useApi();
  const router = useRouter();
  // store: state
  const currencyCode = useCurrencyStore((state) => state.currencyCode);
  const isCurrencyResolved = useCurrencyStore(
    (state) => state.isCurrencyResolved
  );
  const currentPage = useCurrentPage();
  // store: action
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const setSelectedClassification = useProjectStore(
    (state) => state.setSelectedClassification
  );
  const setShowDonatableProjects = useProjectStore(
    (state) => state.setShowDonatableProjects
  );
  const clearFilterStates = useProjectStore((state) => state.clearFilterStates);

  useEffect(() => {
    if (currentPage !== 'project-list') return;
    // Wait for the real currency. `currencyCode` starts at a placeholder, and
    // fetching with it would only be superseded once `localStorage` is read.
    if (!isCurrencyResolved || !currencyCode) return;
    // `fetchProjects` skips redundant requests itself, keyed on locale, currency
    // and tenant.
    fetchProjects(getApi, {
      queryParams: {
        _scope: 'map',
        currency: currencyCode,
        //passing locale/tenant as a query param to break cache when locale changes,
        //as the browser uses the cached response even though the x-locale header is different
        locale,
        tenant: tenantId,
        'filter[purpose]': 'trees,conservation',
      },
    });
  }, [currencyCode, isCurrencyResolved, locale, tenantId, currentPage]);

  useEffect(() => {
    if (router.isReady && currentPage === 'project-list') {
      const { filter, donatable_projects_only } = router.query;

      // Initialize classification filters from URL
      if (filter) {
        const filterValues = typeof filter === 'string' ? [filter] : filter;
        const validFilters = filterValues.filter(isValidClassification);

        if (validFilters.length > 0) {
          setSelectedClassification(validFilters);
        }
      }

      // Initialize donation filter from URL
      if (donatable_projects_only === 'true') {
        setShowDonatableProjects(true);
      }
    }
  }, [router.isReady, currentPage]);

  useEffect(() => {
    if (currentPage === 'project-details') clearFilterStates();
  }, [currentPage]);
};
