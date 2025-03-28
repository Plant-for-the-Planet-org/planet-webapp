import { APIError } from '@planet-sdk/common';
import { getQueryString } from './getQueryString';

export type RequestOptions = {
  /**
   * The URL or path for the API endpoint.
   * Can be absolute (starting with http:// or https://)
   * or relative (will be prepended with apiBaseUrl).
   * @example '/users' or 'https://api.example.com/users'
   */
  url: string;
  /**
   * Optional query parameters to be appended to the URL.
   * Converted to a query string.
   * @example { page: '1', limit: '10' }
   */
  queryParams?: { [key: string]: string };
  /**
   * Optional additional headers to be sent with the request.
   * Useful for custom headers like authorization.
   * @example { 'X-Custom-Header': 'value' }
   */
  additionalHeaders?: { [key: string]: string };
  /**
   * Optional flag to indicate if authentication is required.
   * Can be used to conditionally add authentication headers.
   * @default false
   */
  authRequired?: boolean;
} & /**
 * This type enforces request payload rules based on HTTP method semantics.
 * 'GET' and 'DELETE' requests may optionally include a 'data' payload,
 * whereas 'POST' and 'PUT' requests must include a 'data' payload.
 * Ensures consistency and prevents unintended omissions in API requests.
 */ (
  | { method: 'GET' | 'DELETE'; data?: Record<string, unknown> }
  | { method: 'POST' | 'PUT'; data: Record<string, unknown> }
);

/**
 * Checks if a given URL is an absolute URL.
 *
 * @param url - The URL to check
 * @returns Boolean indicating if the URL is absolute
 *
 * @example
 * isAbsoluteUrl('https://api.example.com') // returns true
 * isAbsoluteUrl('/users') // returns false
 */
function isAbsoluteUrl(url: string) {
  const pattern = /^https?:\/\//i;
  return pattern.test(url);
}

/**
 * A generic API client for making HTTP requests with flexible configuration.
 *
 * @template T - The expected return type of the API response
 * @param requestConfig - Configuration options for the API request
 * @returns A Promise resolving to the API response data
 *
 * @throws {Error} If API_ENDPOINT is not defined in environment variables
 * @throws {APIError} If the API request fails
 *
 * @example
 * // GET request
 * const users = await apiClient<User[]>({
 *   method: 'GET',
 *   url: '/users',
 *   queryParams: { page: '1', limit: '10' }
 * });
 *
 * @example
 * // POST request
 * const newUser = await apiClient<User>({
 *   method: 'POST',
 *   url: '/users',
 *   data: {
 *     username: 'john_doe',
 *     email: 'john@example.com'
 *   }
 * });
 */
const apiClient = async <T>(options: RequestOptions): Promise<T> => {
  const apiBaseUrl = process.env.API_ENDPOINT;
  if (!apiBaseUrl)
    throw new Error(
      'API_ENDPOINT is not defined in your environment variables.'
    );

  const urlPath = isAbsoluteUrl(options.url)
    ? options.url
    : `${apiBaseUrl}${options.url}`;

  // Construct full URL
  const queryString = options.queryParams
    ? '?' + getQueryString(options.queryParams)
    : '';

  const finalUrl = `${urlPath}${queryString}`;

  // Build headers
  const headers: Record<string, string> = options.additionalHeaders ?? {};

  try {
    const response = await fetch(finalUrl, {
      method: options.method,
      headers,
      ...(options.data !== undefined
        ? { body: JSON.stringify(options.data) }
        : {}),
    });

    if (!response.ok) {
      throw new APIError(response.status, await response.json());
    }

    return response.status === 204 ? (true as T) : await response.json();
  } catch (error) {
    console.error('Error during API call:', error);
    throw error;
  }
};

export default apiClient;
