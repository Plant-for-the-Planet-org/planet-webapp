import { ApiCustomError } from '../../features/common/types/apiErrors';
import { TENANT_ID } from '../constants/environment';
import { getQueryString } from './getQueryString';
import getsessionId from './getSessionId';
import { validateToken } from './validateToken';
import { APIError } from '@planet-sdk/common';

// Handle Error responses from API
const handleApiError = (
  error: number,
  result: any,
  errorHandler?: Function,
  redirect?: string
) => {
  if (error === 404) {
    //if error handler is passed, use it
    if (errorHandler) {
      errorHandler({
        type: 'error',
        message: 'notFound',
        redirect: redirect,
        code: error,
      });
    }
    // show error in console
    console.error('Error 404: Requested Resource Not Found!');
  } else if (error === 401) {
    if (errorHandler) {
      errorHandler({
        type: 'warning',
        message: 'unauthorized',
        redirect: redirect,
        code: error,
      });
    }
    console.error('Error 401: You are not Authorized!');
  } else if (error === 403) {
    if (errorHandler) {
      errorHandler({
        type: 'warning',
        message: 'unauthorized',
        redirect: redirect,
        code: error,
      });
    }
    console.error('Error 403: Forbidden');
  } else if (error === 400) {
    if (!result || !result['error_code']) {
      if (errorHandler) {
        errorHandler({
          type: 'error',
          message: 'validationFailed',
          redirect: redirect,
        });
      }
      console.error('Error 400: Validation Failed!');
    }
  } else if (error === 500) {
    if (errorHandler) {
      errorHandler({
        type: 'error',
        message: 'internalServerError',
        redirect: redirect,
        code: error,
      });
    }
    console.error('Error 500: Server Error!');
  }
};

//  API call to private /profile endpoint
export async function getAccountInfo(token: any): Promise<any> {
  const response = await fetch(`${process.env.API_ENDPOINT}/app/profile`, {
    method: 'GET',
    headers: {
      'tenant-key': `${TENANT_ID}`,
      'X-SESSION-ID': await getsessionId(),
      Authorization: `Bearer ${token}`,
      'x-locale': `${
        localStorage.getItem('language')
          ? localStorage.getItem('language')
          : 'en'
      }`,
    },
  });
  return response;
}

function isAbsoluteUrl(url: any) {
  const pattern = /^https?:\/\//i;
  return pattern.test(url);
}

export function getRequest<T>(
  url: any,
  queryParams?: { [key: string]: string },
  version?: string
) {
  const lang = localStorage.getItem('language') || 'en';
  const query: any = { ...queryParams, locale: lang };
  const queryString = getQueryString(query);
  const queryStringSuffix = queryString ? '?' + queryString : '';
  const fullUrl = isAbsoluteUrl(url)
    ? url
    : `${process.env.API_ENDPOINT}${url}${queryStringSuffix}`;

  return new Promise<T>(async (resolve, reject) => {
    try {
      const res = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'tenant-key': `${TENANT_ID}`,
          'X-SESSION-ID': await getsessionId(),
          'x-locale': `${
            localStorage.getItem('language')
              ? localStorage.getItem('language')
              : 'en'
          }`,
          'x-accept-versions': version ? version : '1.0.3',
        },
      });
      if (!res.ok) {
        throw new APIError(res.status, await res.json());
      }
      if (res.status === 204) {
        resolve(true as T);
      } else {
        resolve(await res.json());
      }
    } catch (err) {
      reject(err);
    }
  });
}

export function getAuthenticatedRequest<T>(
  url: any,
  token: any,
  header: any = null,
  queryParams?: { [key: string]: string },
  version?: string
) {
  const lang = localStorage.getItem('language') || 'en';
  const query: any = { ...queryParams };
  const queryString = getQueryString(query);
  const queryStringSuffix = queryString ? '?' + queryString : '';

  return new Promise<T>(async (resolve, reject) => {
    try {
      const res = await fetch(
        `${process.env.API_ENDPOINT}${url}${queryStringSuffix}`,
        {
          method: 'GET',
          headers: {
            'tenant-key': `${TENANT_ID}`,
            'X-SESSION-ID': await getsessionId(),
            Authorization: `Bearer ${token}`,
            'x-locale': `${lang}`,
            'x-accept-versions': version ? version : '1.0.3',
            ...(header ? header : {}),
          },
        }
      );
      if (!res.ok) {
        throw new APIError(res.status, await res.json());
      }
      if (res.status === 204) {
        resolve(true as T);
      } else {
        resolve(await res.json());
      }
    } catch (err) {
      reject(err);
    }
  });
}

export function postAuthenticatedRequest<T>(
  url: any,
  data: any,
  token: any,
  headers?: any
) {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const res = await fetch(process.env.API_ENDPOINT + url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'tenant-key': `${TENANT_ID}`,
          'X-SESSION-ID': await getsessionId(),
          Authorization: `Bearer ${token}`,
          'x-locale': `${
            localStorage.getItem('language')
              ? localStorage.getItem('language')
              : 'en'
          }`,
          ...(headers ? headers : {}),
        },
      });

      if (!res.ok) {
        throw new APIError(res.status, await res.json());
      }

      if (res.status === 204) {
        resolve(true as T);
      } else {
        resolve(await res.json());
      }

    } catch (err) {
      reject(err);
    }
  });
}

export function postRequest<T>(url: any, data: any) {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const res = await fetch(process.env.API_ENDPOINT + url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'tenant-key': `${TENANT_ID}`,
          'X-SESSION-ID': await getsessionId(),
          'x-locale': `${
            localStorage.getItem('language')
              ? localStorage.getItem('language')
              : 'en'
          }`,
        },
      });

      if (!res.ok) {
        throw new APIError(res.status, await res.json());
      }

      if (res.status === 204) {
        resolve(true as T);
      } else {
        resolve(await res.json());
      }

    } catch (err) {
      reject(err);
    }
  });
}

export function deleteAuthenticatedRequest<T>(url: any, token: any) {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const res = await fetch(process.env.API_ENDPOINT + url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'tenant-key': `${TENANT_ID}`,
          'X-SESSION-ID': await getsessionId(),
          Authorization: `Bearer ${token}`,
          'x-locale': `${
            localStorage.getItem('language')
              ? localStorage.getItem('language')
              : 'en'
          }`,
        },
      });

      if (!res.ok) {
        throw new APIError(res.status, await res.json());
      }

      if (res.status === 204) {
        resolve(true as T);
      } else {
        resolve(await res.json());
      }
    } catch (err) {
      reject(err);
    }
  });
}

export function putAuthenticatedRequest<T>(url: any, data: any, token: any) {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const res = await fetch(process.env.API_ENDPOINT + url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'tenant-key': `${TENANT_ID}`,
          'X-SESSION-ID': await getsessionId(),
          Authorization: `Bearer ${token}`,
          'x-locale': `${
            localStorage.getItem('language')
              ? localStorage.getItem('language')
              : 'en'
          }`,
        },
      });

      if (!res.ok) {
        throw new APIError(res.status, await res.json());
      }

      if (res.status === 204) {
        resolve(true as T);
      } else {
        resolve(await res.json());
      }
    } catch (err) {
      reject(err);
    }
  });
}

export function getRasterData<T>(id: any) {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const res = await fetch(
        `${process.env.SITE_IMAGERY_API_URL}/api/v1/project/${id}`
      );

      if (!res.ok) {
        throw new APIError(res.status, await res.json());
      }

      if (res.status === 204) {
        resolve(true as T);
      } else {
        resolve(await res.json());
      }

    } catch (err) {
      reject(err);
    }
  });
}
