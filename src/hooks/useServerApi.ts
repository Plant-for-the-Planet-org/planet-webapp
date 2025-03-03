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
 * Import the `useServerApi` hook and destructure the helper methods as needed:
 *
 * ```typescript
 * import { useServerApi } from 'path-to/useServerApi';
 *
 * const { getApi, postApiAuthenticated, callApi } = useServerApi();
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
 * - `deleteApi`: Makes a DELETE request (unauthenticated).
 * - `deleteApiAuthenticated`: Makes a DELETE request with authentication.
 * - `callApi`: The underlying method that all helpers use for custom API calls, use for custom requirements.
 *
 * @notes
 * - Ensure that `useUserProps` and `useTenant` contexts are properly configured in your application.
 * - Localization (`x-locale`) defaults to the browser's language or 'en' if not set.
 */
import type { ImpersonationData } from '../utils/apiRequests/impersonation';
import type { RequestOptions } from '../utils/apiRequests/apiClient';

import apiClient from '../utils/apiRequests/apiClient';
import getSessionId from '../../src/utils/apiRequests/getSessionId';
import { APIError, ClientError } from '@planet-sdk/common';
import { setHeaderForImpersonation } from '../utils/apiRequests/setHeader';
import { useTenant } from '../features/common/Layout/TenantContext';
import { useUserProps } from '../features/common/Layout/UserPropsContext';
import { validateToken } from '../utils/apiRequests/validateToken';

const INVALID_TOKEN_STATUS_CODE = 498;

export const useServerApi = () => {
  const { token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const lang = localStorage.getItem('language') || 'en';

  function isAbsoluteUrl(url: string) {
    const pattern = /^https?:\/\//i;
    return pattern.test(url);
  }

  const callApi = async <T>({
    method,
    url,
    data,
    queryParams,
    authRequired = false,
    impersonationData,
    version,
  }: Omit<RequestOptions, 'additionalHeaders'> & {
    impersonationData?: ImpersonationData;
    version?: string;
  }): Promise<T> => {
    const headers: Record<string, string> = {
      'x-locale': lang,
      'tenant-key': tenantConfig?.id || '',
      'X-SESSION-ID': await getSessionId(),
    };

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

    headers['x-accept-versions'] = version ? version : '1.0.3';

    const updatedHeaders = setHeaderForImpersonation(
      headers,
      impersonationData
    );

    const fullUrl = isAbsoluteUrl(url)
      ? url
      : `${process.env.API_ENDPOINT}${url}`;

    try {
      return await apiClient<T>({
        method,
        url: fullUrl,
        data,
        queryParams,
        additionalHeaders: updatedHeaders,
      });
    } catch (err) {
      if (err instanceof APIError || err instanceof ClientError) {
        throw err;
      }
      console.error('Unexpected error:', err);
      throw new Error('An unexpected error occurred');
    }
  };

  const getApiAuthenticated = async <T, P extends Record<string, string> = {}>(
    url: string,
    payload?: P,
    impersonationData?: ImpersonationData
  ): Promise<T> => {
    return callApi<T>({
      method: 'GET',
      url,
      queryParams: payload,
      authRequired: true,
      impersonationData,
    });
  };

  const postApiAuthenticated = async <T, P extends Record<string, string> = {}>(
    url: string,
    payload?: P,
    impersonationData?: ImpersonationData
  ): Promise<T> => {
    return callApi<T>({
      method: 'POST',
      url,
      data: payload,
      authRequired: true,
      impersonationData,
    });
  };
  const getApi = async <T, P extends Record<string, string> = {}>(
    url: string,
    payload?: P
  ): Promise<T> => {
    return callApi<T>({ method: 'GET', url, queryParams: payload });
  };

  const postApi = async <T, P extends Record<string, string> = {}>(
    url: string,
    payload?: P
  ): Promise<T> => {
    return callApi<T>({ method: 'POST', url, data: payload });
  };

  const putApi = async <T, P extends Record<string, string> = {}>(
    url: string,
    payload?: P
  ): Promise<T> => {
    return callApi<T>({ method: 'PUT', url, data: payload });
  };

  const putApiAuthenticated = async <T, P extends Record<string, string> = {}>(
    url: string,
    payload?: P
  ): Promise<T> => {
    return callApi<T>({
      method: 'PUT',
      url,
      data: payload,
      authRequired: true,
    });
  };

  const deleteApi = async <T, P extends Record<string, string> = {}>(
    url: string,
    payload?: P
  ): Promise<T> => {
    return callApi<T>({ method: 'DELETE', url, queryParams: payload });
  };

  const deleteApiAuthenticated = async <
    T,
    P extends Record<string, string> = {}
  >(
    url: string,
    payload?: P
  ): Promise<T> => {
    return callApi<T>({
      method: 'DELETE',
      url,
      queryParams: payload,
      authRequired: true,
    });
  };

  return {
    callApi,
    getApi,
    getApiAuthenticated,
    postApi,
    postApiAuthenticated,
    putApi,
    putApiAuthenticated,
    deleteApi,
    deleteApiAuthenticated,
  };
};
