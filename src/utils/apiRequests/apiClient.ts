import { APIError } from '@planet-sdk/common';
import { getQueryString } from './getQueryString';

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  queryParams?: { [key: string]: string };
  additionalHeaders?: { [key: string]: string };
  authRequired?: boolean;
}

type Middleware = (options: RequestOptions) => Promise<RequestOptions>;

const apiClient = async <T>(
  requestOptions: RequestOptions,
  middleware: Middleware[] = []
): Promise<T> => {
  // Apply middleware
  let options = requestOptions;
  for (const mw of middleware) {
    options = await mw(options);
  }

  // Ensure API endpoint is defined
  const baseUrl = process.env.API_ENDPOINT;
  if (!baseUrl) {
    throw new Error(
      'API_ENDPOINT is not defined in your environment variables.'
    );
  }

  // Construct full URL
  const queryString = options.queryParams
    ? '?' + getQueryString(options.queryParams)
    : '';
  const fullUrl = options.url.startsWith('http')
    ? options.url
    : `${baseUrl}${options.url.startsWith('/') ? '' : '/'}${
        options.url
      }${queryString}`;

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.additionalHeaders || {}),
  };

  try {
    const response = await fetch(fullUrl, {
      method: options.method,
      headers,
      body: ['POST', 'PUT'].includes(options.method)
        ? JSON.stringify(options.data)
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
