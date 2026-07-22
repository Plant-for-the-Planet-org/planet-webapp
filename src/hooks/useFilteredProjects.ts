import type { CountryCode } from '@planet-sdk/common';

import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useProjectStore } from '../stores';
import { useTranslations } from 'next-intl';
import {
  filterByClassification,
  filterByDonation,
  filterBySearch,
} from '../utils/projectV2';

export const useFilteredProjects = () => {
  const tCountry = useTranslations('Country');

  const {
    projects,
    showDonatableProjects,
    selectedClassification,
    debouncedSearchValue,
  } = useProjectStore(
    useShallow((state) => ({
      projects: state.projects,
      showDonatableProjects: state.showDonatableProjects,
      selectedClassification: state.selectedClassification,
      debouncedSearchValue: state.debouncedSearchValue,
    }))
  );

  const getCountryLabel = useCallback(
    (code: CountryCode) =>
      tCountry(code.toLowerCase() as Lowercase<CountryCode>),
    [tCountry]
  );

  const filteredProjects = useMemo(() => {
    let result = projects || [];

    if (showDonatableProjects) {
      result = filterByDonation(result);
    }
    if (selectedClassification.length > 0) {
      result = filterByClassification(result, selectedClassification);
    }
    if (debouncedSearchValue) {
      result =
        filterBySearch(result, debouncedSearchValue, getCountryLabel) ?? result;
    }

    return result;
  }, [
    projects,
    showDonatableProjects,
    selectedClassification,
    debouncedSearchValue,
    getCountryLabel,
  ]);

  return { filteredProjects, filteredProjectCount: filteredProjects.length };
};
