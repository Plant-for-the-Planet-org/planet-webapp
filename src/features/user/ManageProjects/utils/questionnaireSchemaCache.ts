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
