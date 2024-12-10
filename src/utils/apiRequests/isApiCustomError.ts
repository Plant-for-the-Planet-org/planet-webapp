import type { ApiCustomError } from '../../features/common/types/apiErrors';

/**
 * Checks if res contains an error_code property.
 * If so, returns a type predicate to indicate that res is of type ApiCustomError
 * @param res API Response
 * @returns type predicate to indicate that res is of type ApiCustomError
 */
export default function isApiCustomError(
  res: ApiCustomError | unknown
): res is ApiCustomError {
  return (res as ApiCustomError).error_code !== undefined;
}
