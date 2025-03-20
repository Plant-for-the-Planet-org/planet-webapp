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

const apiClient = async <T>(requestConfig: RequestOptions): Promise<T> => {
  const config = requestConfig;

  // Construct full URL
  const queryString = config.queryParams
    ? '?' + getQueryString(config.queryParams)
    : '';

  const fullUrl = `${config.url}${queryString}`;

  // Build headers
  const headers: Record<string, string> = {
    ...(config.additionalHeaders || {}),
  };

  try {
    const response = await fetch(fullUrl, {
      method: config.method,
      headers,
      body: ['POST', 'PUT'].includes(config.method)
        ? JSON.stringify(config.data)
        : undefined,
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
