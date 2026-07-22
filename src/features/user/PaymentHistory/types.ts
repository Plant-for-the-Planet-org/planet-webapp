/**
 * Types for the redesigned Payment History feature.
 *
 * Source of truth: treecounter-platform
 *   src/Controller/App/PaymentHistoryController.php
 *   - GET /app/payments          -> payments() list callback
 *   - GET /app/payments/{guid}   -> paymentDetail() / buildPaymentDetails()
 *   src/Pagination/PaginatedCollection.php (envelope)
 *   src/Model/LineItem/LineItemDto.php (lineItems shape)
 *
 * These are the NEW clean endpoints (the redesign target), kept separate from
 * the legacy Elasticsearch-shaped types in
 * src/features/common/types/payments.d.ts which back the old /app/paymentHistory.
 *
 * NOTE ON AMOUNTS: the controller runs AmountNormalizer::fromCents() on both
 * list and detail, so every `amount`/`unitCost` here is already a DECIMAL
 * (e.g. 125.50), not cents. Do not divide by 100.
 */

/** ISO 8601 string with timezone, e.g. "2024-01-15T10:30:00+00:00". */
export type ISODateString = string;

/**
 * Payment status as returned by the backend. Known values are enumerated for
 * autocomplete; the `(string & {})` keeps it open so an unexpected status from
 * the API never breaks typing (we map unknowns to a neutral badge).
 */
export type PaymentStatus =
  | 'paid'
  | 'complete'
  | 'pending'
  | 'failed'
  | 'refunded'
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

/** Generic paginated envelope (PaginatedCollection). */
export interface PaginatedResponse<TItem> {
  items: TItem[];
  /** Total results across all pages. */
  total: number;
  /** Number of items in THIS page. */
  count: number;
  _links: PaginationLinks;
}

/** HATEOAS links. `next`/`prev` are present only when such a page exists. */
export interface PaginationLinks {
  self: string;
  first: string;
  last: string;
  next?: string;
  prev?: string;
}

/**
 * One row in GET /app/payments.
 * @see PaymentHistoryController::payments()
 */
export interface PaymentListItem {
  guid: string;
  /** Human-facing reference / donation uid, e.g. "001242915". */
  reference: string;
  /** Decimal amount (already normalized from cents). */
  amount: number;
  currency: string;
  status: PaymentStatus | null;
  paymentDate: ISODateString | null;
  /**
   * Whether this payment is a gift. Pending a backend addition to the list
   * callback (agreed 2026-07-22); treat as optional until it ships and derive
   * the Donation/Gift label defensively.
   */
  isGift?: boolean;
}

export type PaymentsListResponse = PaginatedResponse<PaymentListItem>;

/**
 * A single line item inside a payment detail.
 * @see LineItemDto::serialize() (amount + units re-normalized in the controller)
 */
export interface PaymentLineItem {
  /** Decimal amount for this line. */
  amount: number | null;
  absorbedFee?: number | null;
  caption?: string | null;
  currency?: string | null;
  /** Destination project name or identifier. */
  destination?: string | null;
  destinationCurrency?: string | null;
  destinationExchangeRate?: number | null;
  isSupport?: boolean | null;
  paymentType?: string | null;
  position?: number | null;
  purpose?: string | null;
  skipValidation?: boolean | null;
  tax?: number | null;
  unitCost?: number | null;
  unitType?: string | null;
  /** Quantity of units (trees, m², etc.), normalized. */
  units?: number | null;
}

/**
 * Gift metadata block. Present only for gift donations; individual fields are
 * conditional (backend runs array_filter, so empty values are omitted).
 * @see PaymentHistoryController::buildPaymentDetails() gift handling
 */
export interface PaymentGift {
  occasion?: string;
  message?: string;
  recipient?: string;
  /** Absolute URL to the gift certificate. */
  certificate?: string;
  /** Absolute URL to the donation codes page. */
  codesUrl?: string;
  /** Bulk-gift comment. */
  comment?: string;
}

/**
 * Fundraiser attached to a donation. NOT yet in the /app/payments/{guid}
 * response — `Donation::getFundraiser()` exists but buildPaymentDetails() does
 * not expose it. Pending a backend addition (agreed 2026-07-22); typed + rendered
 * defensively so it appears the moment the backend includes it.
 */
export interface PaymentFundraiser {
  guid?: string;
  /** Preferred for the public URL; falls back to guid. */
  slug?: string;
  name?: string;
}

/**
 * GET /app/payments/{guid}. Fields marked optional are dropped by the
 * backend's array_filter when empty/null.
 * @see PaymentHistoryController::buildPaymentDetails()
 */
export interface PaymentDetail {
  guid: string;
  reference: string;
  /** Decimal amount. */
  amount: number;
  currency: string;
  status: PaymentStatus | null;
  paymentDate?: ISODateString | null;
  created: ISODateString;
  updated: ISODateString;
  purpose?: string;
  method?: string;
  gateway?: string;
  /** Absolute URL to the donor certificate, when available. */
  certificate?: string;
  gift?: PaymentGift;
  /** Present only once the backend exposes it (see PaymentFundraiser). */
  fundraiser?: PaymentFundraiser;
  lineItems: PaymentLineItem[];
}

/**
 * A saved Stripe payment method (card or SEPA) for the profile, per country.
 * @see UserProfileController::paymentMethods / formatPaymentMethods()
 *   GET /app/profile/paymentMethods/{country}
 */
export interface SavedPaymentMethod {
  /** Stripe payment method id (pm_…) — also the id passed to DELETE. */
  id: string;
  /** "card" | "sepa_debit". */
  type: string;
  isDefault: boolean;
  /** "visa" | "mastercard" | "sepa" | … */
  brand: string | null;
  /** Card last4, or IBAN last4 for SEPA. */
  last4: string | null;
  /** SEPA: IBAN-derived bank country (ISO-2). */
  country?: string | null;
  /** Cards only: "MM/YYYY". */
  expires?: string | null;
}

/** Query params accepted by GET /app/payments (see controller filter/order maps). */
export interface PaymentsListParams {
  page?: number;
  /** Max 100 (backend clamps). */
  limit?: number;
  /** Maps to p.status; supports `status[in]=paid,pending` via the caller. */
  status?: string;
  /** Maps to p.gateway. */
  provider?: string;
  /** Maps to p.method. */
  method?: string;
  /** Maps to d.purpose. */
  purpose?: string;
  /** Maps to d.uid. */
  reference?: string;
  /** e.g. "-created" (default), "created", "amount", "paymentDate". */
  sortBy?: string;
}
