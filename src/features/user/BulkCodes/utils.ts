import type { CountryProject } from '@planet-sdk/common';
import type { RecipientUploadRow } from './BulkCodesTypes';

/**
 * Filters and returns only eligible projects for donation.
 *
 * Rules:
 * - Project must have a unitCost greater than 0
 * - Project purpose must be 'trees' or 'conservation' (see PR #2888)
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
    const isAllowedPurpose =
      project.purpose === 'trees' || project.purpose === 'conservation';

    const isAllowedForCurrency =
      currency !== 'CHF' || allowedCHFProjects.includes(project.slug);

    return isValidUnitCost && isAllowedPurpose && isAllowedForCurrency;
  });
};

// A user cannot send a gift to their own email.
export const isSelfGift = (
  recipientEmail: string,
  giverEmail: string
): boolean => {
  const normalizedRecipientEmail = recipientEmail.trim().toLowerCase();
  if (normalizedRecipientEmail.length === 0) return false;
  return normalizedRecipientEmail === giverEmail.trim().toLowerCase();
};

// Returns 1-based row numbers, matching the row numbers in CSV upload errors.
export const getSelfGiftRows = (
  recipients: RecipientUploadRow[],
  giverEmail: string
): number[] => {
  const rows: number[] = [];
  recipients.forEach((recipient, index) => {
    if (isSelfGift(recipient.recipient_email, giverEmail)) {
      rows.push(index + 1);
    }
  });
  return rows;
};
