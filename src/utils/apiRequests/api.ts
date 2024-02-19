import { getQueryString } from './getQueryString';
import getsessionId from './getSessionId';
import { APIError, ClientError } from '@planet-sdk/common';
import { validateToken } from './validateToken';
import { ImpersonationData } from '../../features/user/Settings/ImpersonateUser/ImpersonateUserForm';
import { setHeaderForImpersonation } from './setHeader';

const INVALID_TOKEN_STATUS_CODE = 498;

//  API call to private /profile endpoint
export async function getAccountInfo(
  tenant: string | undefined,
  token: string | null,
  impersonationData?: ImpersonationData
): Promise<any> {
  const header = {
    'tenant-key': `${tenant}`,
    'X-SESSION-ID': await getsessionId(),
    Authorization: `Bearer ${token}`,
    'x-locale': `${
      localStorage.getItem('language') ? localStorage.getItem('language') : 'en'
    }`,
  };
  const response = await fetch(`${process.env.API_ENDPOINT}/app/profile`, {
    method: 'GET',
    headers: setHeaderForImpersonation(header, impersonationData),
  });

  // TODO: Add error handling after figuring out the nature of getAccountInfo function call with impersonatedEmail

  return response;
}

function isAbsoluteUrl(url: string) {
  const pattern = /^https?:\/\//i;
  return pattern.test(url);
}

export function getRequest<T>(
  tenant: string | undefined,
  url: string,
  queryParams?: { [key: string]: string },
  version?: string
) {
  const lang = localStorage.getItem('language') || 'en';
  const query = { ...queryParams, locale: lang };
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
            'tenant-key': `${tenant}`,
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
  tenant: string | undefined,
  url: string,
  token: string | null,
  logoutUser: (value?: string | undefined) => void,
  header: Record<string, string> | null = null,
  queryParams?: { [key: string]: string },
  version?: string
) {
  const lang = localStorage.getItem('language') || 'en';
  const query = { ...queryParams };
  const queryString = getQueryString(query);
  const queryStringSuffix = queryString ? '?' + queryString : '';

  return new Promise<T>((resolve, reject) => {
    (async () => {
      try {
        if (token && validateToken(token)) {
          const headers = {
            'tenant-key': `${tenant}`,
            'X-SESSION-ID': await getsessionId(),
            Authorization: `Bearer ${token}`,
            'x-locale': `${lang}`,
            'x-accept-versions': version ? version : '1.0.3',
            ...(header ? header : {}),
          };
          const res = await fetch(
            `${process.env.API_ENDPOINT}${url}${queryStringSuffix}`,
            {
              method: 'GET',
              headers: setHeaderForImpersonation(headers),
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
  tenant: string | undefined,
  url: string,
  data: any,
  token: string | null,
  logoutUser: (value?: string | undefined) => void,
  headers?: Record<string, string>
) {
  return new Promise<T>((resolve, reject) => {
    (async () => {
      try {
        if (token && validateToken(token)) {
          const header = {
            'Content-Type': 'application/json',
            'tenant-key': `${tenant}`,
            'X-SESSION-ID': await getsessionId(),
            Authorization: `Bearer ${token}`,
            'x-locale': `${
              localStorage.getItem('language')
                ? localStorage.getItem('language')
                : 'en'
            }`,
            ...(headers ? headers : {}),
          };
          const res = await fetch(process.env.API_ENDPOINT + url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: setHeaderForImpersonation(header),
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

export function postRequest<T>(tenant: string | undefined, url: string, data: any) {
  return new Promise<T>((resolve, reject) => {
    (async () => {
      try {
        const res = await fetch(process.env.API_ENDPOINT + url, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'tenant-key': `${tenant}`,
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
  tenant: string | undefined,
  url: string,
  token: string | null,
  logoutUser: (value?: string | undefined) => void
) {
  return new Promise<T>((resolve, reject) => {
    (async () => {
      try {
        if (token && validateToken(token)) {
          const header = {
            'Content-Type': 'application/json',
            'tenant-key': `${tenant}`,
            'X-SESSION-ID': await getsessionId(),
            Authorization: `Bearer ${token}`,
            'x-locale': `${
              localStorage.getItem('language')
                ? localStorage.getItem('language')
                : 'en'
            }`,
          };
          const res = await fetch(process.env.API_ENDPOINT + url, {
            method: 'DELETE',
            headers: setHeaderForImpersonation(header),
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
  tenant: string | undefined,
  url: string,
  data: any,
  token: string | null,
  logoutUser: (value?: string | undefined) => void
) {
  return new Promise<T>((resolve, reject) => {
    (async () => {
      try {
        if (token && validateToken(token)) {
          const header = {
            'Content-Type': 'application/json',
            'tenant-key': `${tenant}`,
            'X-SESSION-ID': await getsessionId(),
            Authorization: `Bearer ${token}`,
            'x-locale': `${
              localStorage.getItem('language')
                ? localStorage.getItem('language')
                : 'en'
            }`,
          };
          const res = await fetch(process.env.API_ENDPOINT + url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: setHeaderForImpersonation(header),
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

export function getRasterData<T>(id: string) {
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
