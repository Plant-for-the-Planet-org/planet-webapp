/**
 * This custom hook provides a centralized and reusable way to make API requests to the 'API_ENDPOINT' configured in
 * the environment. It abstracts the complexity of handling headers, authentication, impersonation, session management,
 * and error handling, making API calls consistent and easier to manage.
 *
 * @purpose
 * - Simplify API interaction with helper methods for GET, POST, PUT, and DELETE requests.
 * - Automatically handle tenant-based configurations, authentication tokens, and localization.
 * - Provide support for impersonation through headers.
 * - Handle token validation, session ID management, and versioning.
 *
 * @dependencies
 * - React Contexts:
 *   - `useUserProps`: To access the current user's token and handle logout on invalid tokens.
 *   - `useTenant`: To retrieve tenant-specific configurations (e.g., tenant key).
 *   - `useLocale` : To get the current locale for setting the `x-locale` header.
 * - Utilities:
 *   - `apiClient`: A utility to make HTTP requests.
 *   - `validateToken`: To check if the provided token is valid.
 *   - `getSessionId`: To fetch the current session ID.
 *   - `setHeaderForImpersonation`: To add impersonation-related headers to requests.
 * - Error Classes:
 *   - `APIError`: For handling API-specific errors.
 *   - `ClientError`: For client-side errors like expired tokens.
 *
 * @usage
 * Import the `useApi` hook and destructure the helper methods as needed:
 *
 * ```typescript
 * import { useApi } from 'path-to/useApi';
 *
 * const { getApi, postApiAuthenticated } = useApi();
 *
 * // Example: Make a GET request
 * const fetchData = async () => {
 *     try {
 *         const data = await getApi('/endpoint', { queryParam1: 'value' });
 *         console.log(data);
 *     } catch (error) {
 *         console.error('Error fetching data:', error);
 *     }
 * };
 *
 * // Example: Make an authenticated POST request
 * const postData = async () => {
 *     try {
 *         const response = await postApiAuthenticated('/secure-endpoint', { key: 'value' });
 *         console.log(response);
 *     } catch (error) {
 *         console.error('Error posting data:', error);
 *     }
 * };
 * ```
 *
 * @helperMethods
 * - `getApi`: Makes a GET request (unauthenticated).
 * - `getApiAuthenticated`: Makes a GET request with authentication.
 * - `postApi`: Makes a POST request (unauthenticated).
 * - `postApiAuthenticated`: Makes a POST request with authentication.
 * - `putApi`: Makes a PUT request (unauthenticated).
 * - `putApiAuthenticated`: Makes a PUT request with authentication.
 * - `deleteApiAuthenticated`: Makes a DELETE request with authentication.
 *
 * @notes
 * - Ensure that `useUserProps` and `useTenant` contexts are properly configured in your application.
 */
import type { ImpersonationData } from '../utils/apiRequests/impersonation';
import type { RequestOptions } from '../utils/apiRequests/apiClient';

import apiClient from '../utils/apiRequests/apiClient';
import getSessionId from '../utils/apiRequests/getSessionId';
import { APIError, ClientError } from '@planet-sdk/common';
import { setHeaderForImpersonation } from '../utils/apiRequests/setHeader';
import { useTenant } from '../features/common/Layout/TenantContext';
import { useUserProps } from '../features/common/Layout/UserPropsContext';
import { validateToken } from '../utils/apiRequests/validateToken';
import { useLocale } from 'next-intl';

const INVALID_TOKEN_STATUS_CODE = 498;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type ApiConfigBase = {
  queryParams?: Record<string, string>;
  impersonationData?: ImpersonationData;
  additionalHeaders?: Record<string, string>;
  version?: string;
};

type ApiConfigWithPayload<P extends Record<string, unknown>> = {
  payload: P;
} & ApiConfigBase;

type ApiConfigWithoutPayload = ApiConfigBase;

type ApiConfig<
  P extends Record<string, unknown>,
  M extends HttpMethod
> = M extends 'POST' | 'PUT'
  ? ApiConfigWithPayload<P>
  : ApiConfigWithoutPayload;

export const useApi = () => {
  const { token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const locale = useLocale();

  const callApi = async <T>({
    method,
    url,
    data,
    queryParams,
    authRequired = false,
    impersonationData,
    version,
    additionalHeaders,
  }: RequestOptions & {
    impersonationData?: ImpersonationData;
    version?: string;
  }): Promise<T> => {
    const headers: Record<string, string> = {
      'x-locale': locale,
      'tenant-key': tenantConfig?.id || '',
      'X-SESSION-ID': await getSessionId(),
      ...(additionalHeaders ? additionalHeaders : {}),
    };

    // Only add version header if version is explicitly provided. A default could be set using an env var in the future.
    if (version !== undefined) {
      headers['x-accept-versions'] = version;
    }

    if (authRequired) {
      if (!token || !validateToken(token)) {
        logoutUser?.();
        throw new ClientError(INVALID_TOKEN_STATUS_CODE, {
          error_type: 'token_expired',
          error_code: 'token_expired',
        });
      }
      headers.Authorization = `Bearer ${token}`;
    }
    const finalHeader = setHeaderForImpersonation(headers, impersonationData);
    const requestOptions =
      method === 'POST' || method === 'PUT'
        ? { method, url, data, queryParams, additionalHeaders: finalHeader }
        : { method, url, queryParams, additionalHeaders: finalHeader };

    try {
      return await apiClient<T>(requestOptions);
    } catch (err) {
      if (err instanceof APIError || err instanceof ClientError) {
        throw err;
      }
      console.error('Unexpected error:', err);
      throw new Error('An unexpected error occurred');
    }
  };

  /**
   * Performs an authenticated GET request to the specified URL.
   *
   * @template T The expected response type
   * @param {string} url The endpoint URL
   * @param {ApiConfig<never, 'GET'>} [config={}] Optional configuration for the request
   * @returns {Promise<T>} The response data
   * @throws {ClientError} If authentication fails or token is invalid
   */
  const getApiAuthenticated = async <T>(
    url: string,
    config: ApiConfig<never, 'GET'> = {}
  ): Promise<T> => {
    return callApi<T>({
      method: 'GET',
      url,
      authRequired: true,
      ...config,
    });
  };

  /**
   * Performs an authenticated POST request to the specified URL.
   *
   * @template T The expected response type
   * @template P The type of the payload
   * @param {string} url The endpoint URL
   * @param {ApiConfig<P, 'POST'>} config Configuration for the POST request, including payload
   * @returns {Promise<T>} The response data
   * @throws {ClientError} If authentication fails or token is invalid
   */
  const postApiAuthenticated = async <
    T,
    P extends Record<string, unknown> = Record<string, unknown>
  >(
    url: string,
    config: ApiConfig<P, 'POST'>
  ): Promise<T> => {
    return callApi<T>({
      method: 'POST',
      url,
      data: config.payload,
      authRequired: true,
      additionalHeaders: config.additionalHeaders,
    });
  };

  /**
   * Performs an unauthenticated GET request to the specified URL.
   *
   * @template T The expected response type
   * @param {string} url The endpoint URL
   * @param {ApiConfig<never, 'GET'>} [config={}] Optional configuration for the request
   * @returns {Promise<T>} The response data
   */
  const getApi = async <T>(
    url: string,
    config: ApiConfig<never, 'GET'> = {}
  ): Promise<T> => {
    return callApi<T>({
      method: 'GET',
      url,
      ...config,
    });
  };

  /**
   * Performs an unauthenticated POST request to the specified URL.
   *
   * @template T The expected response type
   * @template P The type of the payload
   * @param {string} url The endpoint URL
   * @param {ApiConfig<P, 'POST'>} config Configuration for the POST request, including payload
   * @returns {Promise<T>} The response data
   */
  const postApi = async <
    T,
    P extends Record<string, unknown> = Record<string, unknown>
  >(
    url: string,
    config: ApiConfig<P, 'POST'>
  ): Promise<T> => {
    return callApi<T>({
      method: 'POST',
      url,
      data: config.payload,
      additionalHeaders: config.additionalHeaders,
    });
  };

  /**
   * Performs an unauthenticated PUT request to the specified URL.
   *
   * @template T The expected response type
   * @template P The type of the payload
   * @param {string} url The endpoint URL
   * @param {ApiConfig<P, 'PUT'>} config Configuration for the PUT request, including payload
   * @returns {Promise<T>} The response data
   */
  const putApi = async <
    T,
    P extends Record<string, unknown> = Record<string, unknown>
  >(
    url: string,
    config: ApiConfig<P, 'PUT'>
  ): Promise<T> => {
    return callApi<T>({
      method: 'PUT',
      url,
      data: config.payload,
      additionalHeaders: config.additionalHeaders,
    });
  };

  /**
   * Performs an authenticated PUT request to the specified URL.
   *
   * @template T The expected response type
   * @template P The type of the payload
   * @param {string} url The endpoint URL
   * @param {ApiConfig<P, 'PUT'>} config Configuration for the PUT request, including payload
   * @returns {Promise<T>} The response data
   * @throws {ClientError} If authentication fails or token is invalid
   */
  const putApiAuthenticated = async <
    T,
    P extends Record<string, unknown> = Record<string, unknown>
  >(
    url: string,
    config: ApiConfig<P, 'PUT'>
  ): Promise<T> => {
    return callApi<T>({
      method: 'PUT',
      url,
      data: config.payload,
      authRequired: true,
      queryParams: config.queryParams,
      additionalHeaders: config.additionalHeaders,
    });
  };

  /**
   * Performs an authenticated DELETE request to the specified URL.
   *
   * @template T The expected response type
   * @param {string} url The endpoint URL
   * @param {ApiConfig<never, 'DELETE'>} [config={}] Optional configuration for the request
   * @returns {Promise<T>} The response data
   * @throws {ClientError} If authentication fails or token is invalid
   */
  const deleteApiAuthenticated = async <T>(
    url: string,
    config: ApiConfig<never, 'DELETE'> = {}
  ): Promise<T> => {
    return callApi<T>({
      method: 'DELETE',
      url,
      authRequired: true,
      additionalHeaders: config.additionalHeaders,
    });
  };

  return {
    getApi,
    getApiAuthenticated,
    postApi,
    postApiAuthenticated,
    putApi,
    putApiAuthenticated,
    deleteApiAuthenticated,
  };
};
