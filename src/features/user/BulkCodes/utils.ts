import type { CountryProject } from '@planet-sdk/common';

/**
 * Filters and returns only eligible projects for donation.
 *
 * Rules:
 * - Project must have a unitCost greater than 0
 * - Project classification must not be 'membership' or 'endowment'
 * - If currency is CHF, only projects listed in allowedCHFProjects are allowed
 *
 * @param projects - List of country projects fetched from API
 * @param currency - Current account currency (used for CHF restriction)
 * @returns Filtered list of eligible projects
 */

export const filterEligibleProjects = (
  projects: CountryProject[] | null | undefined,
  currency?: string
): CountryProject[] => {
  if (!Array.isArray(projects) || projects.length === 0) {
    return [];
  }

  const allowedCHFProjects = ['yucatan'];

  return projects.filter((project) => {
    const isValidUnitCost = project.unitCost > 0;
    const isAllowedClassification =
      project.classification !== 'membership' &&
      project.classification !== 'endowment';

    const isAllowedForCurrency =
      currency !== 'CHF' || allowedCHFProjects.includes(project.slug);

    return isValidUnitCost && isAllowedClassification && isAllowedForCurrency;
  });
};
