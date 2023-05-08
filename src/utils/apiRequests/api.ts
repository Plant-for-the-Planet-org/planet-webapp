import { TENANT_ID } from '../constants/environment';
import { getQueryString } from './getQueryString';
import getsessionId from './getSessionId';
import { APIError, ClientError } from '@planet-sdk/common';
import { validateToken } from './validateToken';
import { ImpersonationData } from '../../features/user/Settings/ImpersonateUser/ImpersonateUserForm';
import { setHeaderForImpersonation } from './setHeader';

const INVALID_TOKEN_STATUS_CODE = 498;

//  API call to private /profile endpoint
export async function getAccountInfo(
  token: any,
  impersonationData?:ImpersonationData 
): Promise<any> {
     const header : any = {
      'tenant-key': `${TENANT_ID}`,
      'X-SESSION-ID': await getsessionId(),
      Authorization: `Bearer ${token}`,
      'x-locale': `${
        localStorage.getItem('language')
          ? localStorage.getItem('language')
          : 'en'
      }`,
    }
    const response = await fetch(`${process.env.API_ENDPOINT}/app/profile`, {
    method: 'GET',
    headers: setHeaderForImpersonation(header,impersonationData)
  });

  // TODO: Add error handling after figuring out the nature of getAccountInfo function call with impersonatedEmail

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

  return new Promise<T>((resolve, reject) => {
    (async () => {
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
    })();
  });
}

export function getAuthenticatedRequest<T>(
  url: any,
  token: any,
  logoutUser: (value?: string | undefined) => void,
  header: any = null,
  queryParams?: { [key: string]: string },
  version?: string
) {
  const lang = localStorage.getItem('language') || 'en';
  const query: any = { ...queryParams };
  const queryString = getQueryString(query);
  const queryStringSuffix = queryString ? '?' + queryString : '';

  return new Promise<T>((resolve, reject) => {
    (async () => {
      try {
        if (validateToken(token)) {
          const headers = {
            'tenant-key': `${TENANT_ID}`,
            'X-SESSION-ID': await getsessionId(),
            Authorization: `Bearer ${token}`,
            'x-locale': `${lang}`,
            'x-accept-versions': version ? version : '1.0.3',
            ...(header ? header : {}),
          }
          const res = await fetch(
            `${process.env.API_ENDPOINT}${url}${queryStringSuffix}`,
            {
              method: 'GET',
              headers: setHeaderForImpersonation(headers)
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
        } else {
          logoutUser();
          throw new ClientError(INVALID_TOKEN_STATUS_CODE, {
            error_type: 'token_expired',
            error_code: 'token_expired',
          });
        }
      } catch (err) {
        reject(err);
      }
    })();
  });
}

export function postAuthenticatedRequest<T>(
  url: any,
  data: any,
  token: any,
  logoutUser: (value?: string | undefined) => void,
  headers?: any
) {
  return new Promise<T>((resolve, reject) => {
    (async () => {
      try {
        if (validateToken(token)) {
          const header =  {
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
            }
          const res = await fetch(process.env.API_ENDPOINT + url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: setHeaderForImpersonation(header)
          });

          if (!res.ok) {
            throw new APIError(res.status, await res.json());
          }

          if (res.status === 204) {
            resolve(true as T);
          } else {
            resolve(await res.json());
          }
        } else {
          logoutUser();
          throw new ClientError(INVALID_TOKEN_STATUS_CODE, {
            error_type: 'token_expired',
            error_code: 'token_expired',
          });
        }
      } catch (err) {
        reject(err);
      }
    })();
  });
}

export function postRequest<T>(url: any, data: any) {
  return new Promise<T>((resolve, reject) => {
    (async () => {
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
    })();
  });
}

export function deleteAuthenticatedRequest<T>(
  url: any,
  token: any,
  logoutUser: (value?: string | undefined) => void,
) {
  return new Promise<T>((resolve, reject) => {
    (async () => {
      try {
        if (validateToken(token)) {
          const header = {
            'Content-Type': 'application/json',
            'tenant-key': `${TENANT_ID}`,
            'X-SESSION-ID': await getsessionId(),
            Authorization: `Bearer ${token}`,
            'x-locale': `${
              localStorage.getItem('language')
                ? localStorage.getItem('language')
                : 'en'
            }`,
          }
          const res = await fetch(process.env.API_ENDPOINT + url, {
            method: 'DELETE',
            headers: setHeaderForImpersonation(header)
          });

          if (!res.ok) {
            throw new APIError(res.status, await res.json());
          }

          if (res.status === 204) {
            resolve(true as T);
          } else {
            resolve(await res.json());
          }
        } else {
          logoutUser();
          throw new ClientError(INVALID_TOKEN_STATUS_CODE, {
            error_type: 'token_expired',
            error_code: 'token_expired',
          });
        }
      } catch (err) {
        reject(err);
      }
    })();
  });
}

export function putAuthenticatedRequest<T>(
  url: any,
  data: any,
  token: any,
  logoutUser: (value?: string | undefined) => void,
) {
  return new Promise<T>((resolve, reject) => {
    (async () => {
      try {
        if (validateToken(token)) {
          const header = {
            'Content-Type': 'application/json',
            'tenant-key': `${TENANT_ID}`,
            'X-SESSION-ID': await getsessionId(),
            Authorization: `Bearer ${token}`,
            'x-locale': `${
              localStorage.getItem('language')
                ? localStorage.getItem('language')
                : 'en'
            }`,
          }
          const res = await fetch(process.env.API_ENDPOINT + url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: setHeaderForImpersonation(header)
          });

          if (!res.ok) {
            throw new APIError(res.status, await res.json());
          }

          if (res.status === 204) {
            resolve(true as T);
          } else {
            resolve(await res.json());
          }
        } else {
          logoutUser();
          throw new ClientError(INVALID_TOKEN_STATUS_CODE, {
            error_type: 'token_expired',
            error_code: 'token_expired',
          });
        }
      } catch (err) {
        reject(err);
      }
    })();
  });
}

export function getRasterData<T>(id: any) {
  return new Promise<T>((resolve, reject) => {
    (async () => {
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
    })();
  });
}
