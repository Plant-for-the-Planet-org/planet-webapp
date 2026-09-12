import type { QuestionnaireSchema } from '../../../common/types/project';

/**
 * Module-level in-memory cache for questionnaire schemas.
 *
 * Schemas are keyed by `${purpose}-${locale}` so translated variants are
 * cached independently. The cache lives for the full browser session
 * (survives client-side navigation) but is cleared on hard refresh —
 * appropriate for content that may be updated by the backend between
 * deployments.
 */
const schemaCache = new Map<string, QuestionnaireSchema>();

/**
 * Requests that have been issued but not yet resolved.
 *
 * Checking only the completed cache is not enough to avoid duplicate work:
 * several places kick off a schema fetch as soon as they mount (the prefetch,
 * the completeness calculation, the questionnaire form itself), and they all
 * start before any of them has finished. Each would see an empty cache and
 * issue its own request. Sharing the pending promise means the first caller
 * performs the request and the rest await that same one.
 */
const inFlight = new Map<string, Promise<QuestionnaireSchema>>();

export function getCachedSchema(
  purpose: string,
  locale: string
): QuestionnaireSchema | undefined {
  return schemaCache.get(`${purpose}-${locale}`);
}

export function setCachedSchema(
  purpose: string,
  locale: string,
  schema: QuestionnaireSchema
): void {
  schemaCache.set(`${purpose}-${locale}`, schema);
}

/**
 * Returns the cached schema, the in-flight request for it, or starts one.
 *
 * `fetcher` is only invoked when neither a cached value nor a pending request
 * exists. A failed request is removed from the pending map so a later attempt
 * (for example the questionnaire's Try again) can retry rather than re-await a
 * rejected promise.
 */
export function getOrFetchSchema(
  purpose: string,
  locale: string,
  fetcher: () => Promise<QuestionnaireSchema>
): Promise<QuestionnaireSchema> {
  const key = `${purpose}-${locale}`;

  const cached = schemaCache.get(key);
  if (cached) return Promise.resolve(cached);

  const pending = inFlight.get(key);
  if (pending) return pending;

  const request = fetcher()
    .then((schema) => {
      schemaCache.set(key, schema);
      return schema;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, request);

  return request;
}
