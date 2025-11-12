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
 * Determines overview receipt eligibility for a specific year
 * @param year - The year to check eligibility for
 * @param receipts - The receipts for that year
 * @param lastConsolidatedYear - The last year that has been consolidated
 * @param currentYear - Optional current year override (defaults to actual current year)
 * @returns Overview eligibility information
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
