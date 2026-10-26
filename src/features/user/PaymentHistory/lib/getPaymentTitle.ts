import type { PaymentListItem, PaymentListLineItem } from '../types';

export type PaymentTitleLabels = {
  /** "Trees", "Membership", "Donation", … for a line item purpose. */
  purpose: (purpose: string | null | undefined) => string;
  /** "50 Trees", "120 m²". */
  units: (units: number, unitType: 'tree' | 'm2') => string;
  /** "50 Trees + support" for a mixed donation. */
  withSupport: (label: string) => string;
  /** Joins purpose labels for the locale, e.g. "Trees and Academy". */
  list: (labels: string[]) => string;
};

const FUNDS = 'funds';

const isUnitBased = (line: PaymentListLineItem) =>
  line.units != null && (line.unitType === 'tree' || line.unitType === 'm2');

/**
 * One line item, as explicit as it gets: "50 Trees • Plant-for-Ghana",
 * "Membership • Donor-Circle". A caption that already names the purpose
 * ("PlanetCash - Jane Doe") stands alone. `withSupport` marks the trees line of
 * a mixed donation before the project name, so a long name that gets truncated
 * never hides it.
 */
const describeLine = (
  line: PaymentListLineItem,
  labels: PaymentTitleLabels,
  withSupport = false
): string => {
  const label = isUnitBased(line)
    ? labels.units(line.units as number, line.unitType as 'tree' | 'm2')
    : labels.purpose(line.purpose);
  const caption = line.caption?.trim();
  const lead = withSupport ? labels.withSupport(label) : label;

  if (!caption) return lead;
  if (!withSupport && caption.toLowerCase().includes(label.toLowerCase())) {
    return caption;
  }
  return `${lead} • ${caption}`;
};

/**
 * A mixed donation is the older shape that is still created by subscriptions:
 * one line supports the organization (funds) and the other plants trees.
 */
const getMixedTreeLine = (lines: PaymentListLineItem[]) => {
  if (lines.length !== 2) return null;
  const funds = lines.find((line) => line.purpose === FUNDS);
  const trees = lines.find((line) => line.purpose === 'trees');
  return funds && trees ? trees : null;
};

/**
 * What a payment was for, as a list row title.
 *
 * - One line item: its purpose or units and its project.
 * - Mixed (funds + trees): the trees line, plus support.
 * - Any other set of line items has no lead project, so the title names only
 *   the kinds of purpose ("Trees and Donation"). The amount column carries the
 *   total, and the detail view lists the parts.
 */
export const getPaymentTitle = (
  item: Pick<PaymentListItem, 'purpose' | 'lineItems'>,
  labels: PaymentTitleLabels
): string => {
  const lines = item.lineItems ?? [];

  if (lines.length === 0) return labels.purpose(item.purpose);
  if (lines.length === 1) return describeLine(lines[0], labels);

  const treeLine = getMixedTreeLine(lines);
  if (treeLine) return describeLine(treeLine, labels, true);

  // Funds last: "Trees and Donation" reads as what was given, plus support.
  const purposes = [...new Set(lines.map((line) => line.purpose ?? ''))].sort(
    (a, b) => Number(a === FUNDS) - Number(b === FUNDS)
  );
  return labels.list(purposes.map((purpose) => labels.purpose(purpose)));
};
