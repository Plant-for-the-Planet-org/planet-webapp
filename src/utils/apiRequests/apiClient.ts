import { APIError } from '@planet-sdk/common';
import { getQueryString } from './getQueryString';

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: Record<string, string>;
  queryParams?: { [key: string]: string };
  additionalHeaders?: { [key: string]: string };
  authRequired?: boolean;
}

function isAbsoluteUrl(url: string) {
  const pattern = /^https?:\/\//i;
  return pattern.test(url);
}

const apiClient = async <T>(requestConfig: RequestOptions): Promise<T> => {
  const config = requestConfig;

  const apiBaseUrl = process.env.API_ENDPOINT;
  if (!apiBaseUrl)
    throw new Error(
      'API_ENDPOINT is not defined in your environment variables.'
    );

  const urlPath = isAbsoluteUrl(config.url)
    ? config.url
    : `${apiBaseUrl}${config.url}`;

  // Construct full URL
  const queryString = config.queryParams
    ? '?' + getQueryString(config.queryParams)
    : '';

  const finalUrl = `${urlPath}${queryString}`;

  // Build headers
  const headers: Record<string, string> = config.additionalHeaders ?? {};

  try {
    const response = await fetch(finalUrl, {
      method: config.method,
      headers,
      ...(config.method === 'POST' || config.method === 'PUT'
        ? { body: JSON.stringify(config.data) }
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
