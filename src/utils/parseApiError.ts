import { handleError } from '@planet-sdk/common';
import type { APIError, SerializedError } from '@planet-sdk/common';

/**
 * Wraps handleError with a fallback for API error shapes it does not recognise.
 *
 * handleError only handles CustomError (error_code), FormError (errors),
 * HTTPError (message), and a limited set of status codes. It silently returns []
 * for anything else — including the {"error": "..."} body the backend sends on
 * 409 Conflict responses.
 *
 * A plain string body (e.g. thrown by fetchUserProfile) is returned as-is. This check runs before handleError, which would otherwise swap the text for a status key like "internalServerError" on 500 or drop it on other statuses.
 *
 * This function ensures callers always receive at least one SerializedError.
 */
export function parseApiError(err: APIError): SerializedError[] {
  if (typeof err.errors === 'string') return [{ message: err.errors }];

  const serialized = handleError(err);
  if (serialized.length > 0) return serialized;

  const body = err.errors as Record<string, unknown>;

  if (body && typeof body.error === 'string') {
    return [{ message: body.error }];
  }

  return [{ message: 'generic_error', errorType: 'generic_error' }];
}
