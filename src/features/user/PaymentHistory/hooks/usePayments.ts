import type { APIError } from '@planet-sdk/common';
import type {
  PaymentListItem,
  PaymentsListParams,
  PaymentsListResponse,
} from '../types';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { handleError } from '@planet-sdk/common';

import { useApi } from '@/hooks/useApi';
import { useErrorHandlingStore } from '@/stores/errorHandlingStore';

const DEFAULT_LIMIT = 50; // "load 50 at a time" (Requirements Nov 3rd, 2025)

/**
 * Translate typed list params into the query string the backend expects.
 * A comma-separated `status` is sent as `status[in]=a,b` (see
 * MappedDoctrineQueryHelper operator syntax).
 */
const buildQueryParams = (
  params: PaymentsListParams
): Record<string, string> => {
  const q: Record<string, string> = {};
  const { page, limit, status, provider, method, purpose, reference, sortBy } =
    params;

  q.limit = String(limit ?? DEFAULT_LIMIT);
  if (page != null) q.page = String(page);
  if (status) {
    if (status.includes(',')) q['status[in]'] = status;
    else q.status = status;
  }
  if (provider) q.provider = provider;
  if (method) q.method = method;
  if (purpose) q.purpose = purpose;
  if (reference) q.reference = reference;
  if (sortBy) q.sortBy = sortBy;

  return q;
};

/** Split a HATEOAS link into a path + query params for re-requesting. */
const parseLink = (
  link: string
): { path: string; queryParams: Record<string, string> } | null => {
  try {
    const url = new URL(link, 'https://base.invalid');
    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    return { path: url.pathname, queryParams };
  } catch {
    return null;
  }
};

export interface UsePaymentsResult {
  payments: PaymentListItem[];
  /** Initial load or a filter/sort change. */
  isLoading: boolean;
  /** A "load more" append is in flight. */
  isLoadingMore: boolean;
  error: unknown;
  /** Total number of payments across all pages. */
  total: number;
  hasMore: boolean;
  loadMore: () => void;
  reload: () => void;
}

/**
 * Fetches the authenticated donor payments list from GET /app/payments,
 * following `_links.next` for pagination (same HATEOAS pattern the legacy
 * history page uses). Errors are surfaced locally and pushed to the global
 * error store, consistent with the rest of the app.
 */
export const usePayments = (
  params: PaymentsListParams = {}
): UsePaymentsResult => {
  const { getApiAuthenticated } = useApi();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  // Refs so the fetch effect does not depend on per-render function identities.
  const apiRef = useRef(getApiAuthenticated);
  apiRef.current = getApiAuthenticated;
  const setErrorsRef = useRef(setErrors);
  setErrorsRef.current = setErrors;

  const [payments, setPayments] = useState<PaymentListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [nextLink, setNextLink] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // Stable, value-based key so an inline params object does not cause refetch loops.
  const queryParamsKey = useMemo(
    () => JSON.stringify(buildQueryParams(params)),
    [params]
  );

  // Guards against out-of-order responses when params change quickly.
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    apiRef
      .current<PaymentsListResponse>('/app/payments', {
        queryParams: JSON.parse(queryParamsKey),
      })
      .then((res) => {
        if (requestId !== requestIdRef.current) return;
        setPayments(res.items ?? []);
        setTotal(res.total ?? 0);
        setNextLink(res._links?.next);
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        setError(err);
        setErrorsRef.current(handleError(err as APIError));
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setIsLoading(false);
      });
  }, [queryParamsKey, reloadToken]);

  const loadMore = useCallback(() => {
    if (!nextLink || isLoadingMore || isLoading) return;
    const parsed = parseLink(nextLink);
    if (!parsed) return;

    const requestId = requestIdRef.current; // append to the current result set
    setIsLoadingMore(true);

    apiRef
      .current<PaymentsListResponse>(parsed.path, {
        queryParams: parsed.queryParams,
      })
      .then((res) => {
        if (requestId !== requestIdRef.current) return;
        setPayments((prev) => [...prev, ...(res.items ?? [])]);
        setTotal(res.total ?? 0);
        setNextLink(res._links?.next);
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        setErrorsRef.current(handleError(err as APIError));
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setIsLoadingMore(false);
      });
  }, [nextLink, isLoadingMore, isLoading]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return {
    payments,
    isLoading,
    isLoadingMore,
    error,
    total,
    hasMore: Boolean(nextLink),
    loadMore,
    reload,
  };
};
