export interface ApiCustomError {
  [key: string]: undefined;
  //Added to allow us to discriminate between this type and other types contained in a Union
  error_type: string;
  error_code: string;
  parameters?: {
    [key: string]: string | number | boolean;
  };
}

/**
 * Checks if res contains an error_code property.
 * If so, returns a type predicate to indicate that res is of type ApiCustomError
 * @param res API Response
 * @returns type predicate to indicate that res is of type ApiCustomError
 */
export function isApiCustomError(
  res: ApiCustomError | unknown
): res is ApiCustomError {
  return (res as ApiCustomError).error_code !== undefined;
}
