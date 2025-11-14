import type {
  DonationReceiptsStatus,
  IssuedReceiptDataApi,
  UnissuedReceiptDataAPI,
  YearlyGroupedReceipts,
  OverviewEligibility,
  OverviewButtonState,
} from './donationReceiptTypes';

/**
 * Extracts year from a date string or number
 * @param date - Date string in ISO format or year number
 * @returns Year as string
 */
export const extractYear = (date: string | number): string => {
  if (typeof date === 'number') {
    return date.toString();
  }

  if (typeof date === 'string') {
    // Handle ISO date strings (e.g., "2023-12-15T10:30:00Z")
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.getFullYear().toString();
    }

    // Fallback: try to extract year from string directly
    const yearMatch = date.match(/(\d{4})/);
    if (yearMatch) {
      return yearMatch[1];
    }
  }

  // Fallback to current year if parsing fails
  return new Date().getFullYear().toString();
};

/**
 * Extracts year from issued receipt
 * @param receipt - Issued receipt data
 * @returns Year as string
 */
export const extractYearFromReceipt = (
  receipt: IssuedReceiptDataApi | UnissuedReceiptDataAPI
): string => {
  // Prefer the year field if available
  if (receipt.year) {
    return String(receipt.year);
  }

  // Fall back to extracting from paymentDate
  return extractYear(receipt.paymentDate);
};

/**
 * Groups receipts by year from their payment dates
 * @param receiptsStatus - The donation receipts status containing issued and unissued receipts
 * @returns Receipts grouped by year in descending order
 */
export const groupReceiptsByYear = (
  receiptsStatus: DonationReceiptsStatus
): YearlyGroupedReceipts => {
  const groupedReceipts: YearlyGroupedReceipts = {};

  // Group issued receipts by year
  receiptsStatus.issued.forEach((receipt) => {
    const year = extractYearFromReceipt(receipt);

    if (!groupedReceipts[year]) {
      groupedReceipts[year] = {
        issued: [],
        unissued: [],
      };
    }

    groupedReceipts[year].issued.push(receipt);
  });

  // Group unissued receipts by year
  receiptsStatus.unissued.forEach((receipt) => {
    const year = extractYearFromReceipt(receipt);

    if (!groupedReceipts[year]) {
      groupedReceipts[year] = {
        issued: [],
        unissued: [],
      };
    }

    groupedReceipts[year].unissued.push(receipt);
  });

  return groupedReceipts;
};

/**
 * Gets sorted years in descending order (most recent first)
 * @param groupedReceipts - Receipts grouped by year
 * @returns Array of years sorted in descending order
 */
export const getSortedYears = (
  groupedReceipts: YearlyGroupedReceipts
): string[] => {
  return Object.keys(groupedReceipts).sort((a, b) => parseInt(b) - parseInt(a));
};

/**
 * Determines if a receipt is verified (for issued receipts)
 * @param receipt - Issued receipt data
 * @returns True if receipt is verified
 */
export const isReceiptVerified = (receipt: IssuedReceiptDataApi): boolean => {
  return (
    receipt.verificationDate !== null &&
    receipt.verificationDate !== undefined &&
    Boolean(receipt.downloadUrl)
  );
};

/**
 * Determines the UI state of the overview download button based on
 * eligibility conditions for the given year.
 *
 * Button state rules:
 * - If the button cannot be rendered → 'hidden'
 * - If it is the current year → 'inactive-future' (future overview not yet available)
 * - If the year is not consolidated → 'hidden'
 * - If consolidated and all receipts are verified → 'active'
 * - Otherwise → 'inactive-unverified' (some receipts still unverified)
 *
 * @param canRender - Whether the button should be rendered at all
 * @param isCurrentYear - Whether the year is the ongoing calendar year
 * @param isConsolidated - Whether the year is within the consolidated limit
 * @param allReceiptsVerified - Whether every issued receipt is verified
 * @returns The corresponding overview button state
 */

const determineButtonState = (
  canRender: boolean,
  isCurrentYear: boolean,
  isConsolidated: boolean,
  allReceiptsVerified: boolean
): OverviewButtonState => {
  if (!canRender) return 'hidden';
  if (isCurrentYear) return 'inactive-future';
  if (!isConsolidated) return 'hidden';
  return allReceiptsVerified ? 'active' : 'inactive-unverified';
};

/**
 * Calculates whether an overview receipt can be generated for a specific year,
 * and determines the corresponding button state and receipt verification details.
 *
 * Overview rendering eligibility:
 * - Year must not be in the future (year ≤ current year)
 * - Must have more than 1 issued receipt for that year
 *
 * @param year - Year to evaluate overview eligibility for
 * @param receipts - Issued and unissued receipts for the selected year
 * @param lastConsolidatedYear - The most recent year that has been consolidated
 * @param currentYear - Optional override for the current calendar year
 * @returns Overview eligibility including counts, consolidated flag and button state
 */

export const determineOverviewEligibility = (
  year: string,
  receipts: {
    issued: IssuedReceiptDataApi[];
    unissued: UnissuedReceiptDataAPI[];
  },
  lastConsolidatedYear: number,
  currentYear = new Date().getFullYear()
): OverviewEligibility => {
  const issuedReceipts = receipts.issued;
  const totalIssuedCount = issuedReceipts.length;
  const yearNumber = parseInt(year);

  // Only consider issued receipts for overview eligibility
  const verifiedReceipts = issuedReceipts.filter(isReceiptVerified);
  const verifiedCount = verifiedReceipts.length;
  const allReceiptsVerified =
    verifiedCount === totalIssuedCount && totalIssuedCount > 0;

  // Check if the year is consolidated (year <= lastConsolidatedYear)
  const isConsolidated = yearNumber <= lastConsolidatedYear;
  const isCurrentYear = yearNumber === currentYear;

  // Rule: render only if:
  // 1. year <= currentYear (not future year)
  // 2. totalIssuedCount > 1 (more than 1 receipt)
  const canRender = yearNumber <= currentYear && totalIssuedCount > 1;

  // Determine button state
  const buttonState = determineButtonState(
    canRender,
    isCurrentYear,
    isConsolidated,
    allReceiptsVerified
  );

  return {
    year,
    isEligible: buttonState === 'active',
    verifiedCount,
    totalCount: totalIssuedCount,
    isConsolidated,
    buttonState,
  };
};

/**
 * Gets overview eligibility for all years
 * @param groupedReceipts - Receipts grouped by year
 * @param lastConsolidatedYear - The last year that has been consolidated
 * @param currentYear - Optional current year override (defaults to actual current year)
 * @returns Map of year to overview eligibility
 */
export const getOverviewEligibilityForAllYears = (
  groupedReceipts: YearlyGroupedReceipts,
  lastConsolidatedYear: number,
  currentYear?: number
): Record<string, OverviewEligibility> => {
  const eligibilityMap: Record<string, OverviewEligibility> = {};

  Object.entries(groupedReceipts).forEach(([year, receipts]) => {
    eligibilityMap[year] = determineOverviewEligibility(
      year,
      receipts,
      lastConsolidatedYear,
      currentYear
    );
  });

  return eligibilityMap;
};
