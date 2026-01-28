import { useLocale } from 'next-intl';
import { useTenant } from '../features/common/Layout/TenantContext';
import { useEffect } from 'react';
import { useProjectStore, useViewStore } from '../stores';
import { useApi } from './useApi';
import { useCurrencyStore } from '../stores/currencyStore';
import { useRouter } from 'next/router';
import { isValidClassification } from '../utils/projectV2';

export const useInitializeProject = () => {
  const locale = useLocale();
  const { tenantConfig } = useTenant();
  const { getApi } = useApi();
  const router = useRouter();
  // store: state
  const currencyCode = useCurrencyStore((state) => state.currencyCode);
  const currentPage = useViewStore((state) => state.page);
  const projectsCurrencyCode = useProjectStore(
    (state) => state.projectsCurrencyCode
  );
  const projectsLocale = useProjectStore((state) => state.projectsLocale);
  const projects = useProjectStore((state) => state.projects);
  // store: action
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const setSelectedClassification = useProjectStore(
    (state) => state.setSelectedClassification
  );
  const setShowDonatableProjects = useProjectStore(
    (state) => state.setShowDonatableProjects
  );

  useEffect(() => {
    if (currentPage !== 'project-list' || !currencyCode) return;
    if (
      projectsLocale === locale &&
      projectsCurrencyCode === currencyCode &&
      projects !== null
    )
      return;

    fetchProjects(getApi, {
      queryParams: {
        _scope: 'map',
        currency: currencyCode,
        //passing locale/tenant as a query param to break cache when locale changes,
        //as the browser uses the cached response even though the x-locale header is different
        locale,
        tenant: tenantConfig.id,
        'filter[purpose]': 'trees,conservation',
      },
    });
  }, [currencyCode, locale, tenantConfig.id, currentPage]);

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
  }, [router.isReady]);
};
