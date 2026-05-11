import type { QuestionnaireSchema } from '../../../common/types/project';

/**
 * Module-level in-memory cache for questionnaire schemas.
 *
 * Schemas are static per project purpose and never change at runtime, so
 * caching them here avoids repeated HTTP calls every time the component
 * mounts or the parent re-runs its pre-compute effect.
 *
 * The cache lives for the full browser session (survives client-side
 * navigation) but is cleared on hard refresh — appropriate for content
 * that may be updated by the backend between deployments.
 */
const schemaCache = new Map<string, QuestionnaireSchema>();

export function getCachedSchema(
  purpose: string
): QuestionnaireSchema | undefined {
  return schemaCache.get(purpose);
}

export function setCachedSchema(
  purpose: string,
  schema: QuestionnaireSchema
): void {
  schemaCache.set(purpose, schema);
}
