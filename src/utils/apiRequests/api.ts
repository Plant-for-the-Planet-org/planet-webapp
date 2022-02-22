import { TENANT_ID } from '../constants/environment';
import getsessionId from './getSessionId';
import { validateToken } from './validateToken';

// Handle Error responses from API
const handleApiError = (
  error: any,
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
      });
    }
    console.error('Error 401: You are not Authorized!');
  } else if (error === 403) {
    if (errorHandler) {
      errorHandler({
        type: 'warning',
        message: 'unauthorized',
        redirect: redirect,
      });
    }
    console.error('Error 403: Forbidden');
  } else if (error === 400) {
    if (errorHandler) {
      errorHandler({
        type: 'error',
        message: 'validationFailed',
        redirect: redirect,
      });
    }
    console.error('Error 400: Validation Failed!');
  } else if (error === 500) {
    if (errorHandler) {
      errorHandler({
        type: 'error',
        message: 'internalServerError',
        redirect: redirect,
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

export async function getRequest(
  url: any,
  errorHandler?: Function,
  redirect?: string,
  queryParams?: { [key: string]: string }
) {
  let result;
  const lang = localStorage.getItem('language') || 'en';
  const query: any = { ...queryParams, locale: lang };
  const queryString = Object.keys(query)
    .map((key) => key + '=' + query[key])
    .join('&');
  await fetch(`${process.env.API_ENDPOINT}${url}?${queryString}`, {
    method: 'GET',
    headers: {
      'tenant-key': `${TENANT_ID}`,
      'X-SESSION-ID': await getsessionId(),
      'x-locale': `${
        localStorage.getItem('language')
          ? localStorage.getItem('language')
          : 'en'
      }`,
    },
  })
    .then(async (res) => {
      result = res.status === 200 ? await res.json() : null;
      handleApiError(res.status, errorHandler, redirect);
    })
    .catch((err) => console.error(`Unhandled Exception: ${err}`));
  return result;
}

export async function getAuthenticatedRequest(
  url: any,
  token: any,
  header: any = null,
  errorHandler?: Function,
  redirect?: string
): Promise<any> {
  let result = {};
  await fetch(`${process.env.API_ENDPOINT}` + url, {
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
      'x-accept-versions': '1.0.3',
    },
  })
    .then(async (res) => {
      result = res.status === 200 ? await res.json() : null;
      handleApiError(res.status, errorHandler, redirect);
    })
    .catch((err) => console.log(`Something went wrong: ${err}`));
  return result;
}

export async function postAuthenticatedRequest(
  url: any,
  data: any,
  token: any,
  errorHandler?: Function
): Promise<any> {
  if (validateToken(token)) {
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
      },
    });
    const result = await res.json();
    handleApiError(res.status, errorHandler);
    return result;
  } else {
    if (errorHandler) {
      errorHandler({
        type: 'warning',
        message: 'unauthorized',
      });
    }
    console.error('Error 401: You are not Authorized!');
    return null;
  }
}

export async function postRequest(
  url: any,
  data: any,
  errorHandler?: Function
): Promise<any> {
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
  const result = await res.json();
  handleApiError(res.status, errorHandler);
  return result;
}

export async function deleteAuthenticatedRequest(
  url: any,
  token: any,
  errorHandler?: Function
): Promise<any> {
  let result;
  if (validateToken(token)) {
    await fetch(process.env.API_ENDPOINT + url, {
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
    }).then((res) => {
      result = res.status;
      handleApiError(res.status, errorHandler);
    });
  } else {
    if (errorHandler) {
      errorHandler({
        type: 'warning',
        message: 'unauthorized',
      });
    }
    console.error('Error 401: You are not Authorized!');
  }
  return result;
}

export async function putAuthenticatedRequest(
  url: any,
  data: any,
  token: any,
  errorHandler?: Function
): Promise<any> {
  if (validateToken(token)) {
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
    const result = await res.json();
    handleApiError(res.status, errorHandler);
    return result;
  } else {
    if (errorHandler) {
      errorHandler({
        type: 'warning',
        message: 'unauthorized',
      });
    }
    console.error('Error 401: You are not Authorized!');
  }
}

export async function putRequest(
  url: any,
  data: any,
  errorHandler?: Function
): Promise<any> {
  const res = await fetch(process.env.API_ENDPOINT + url, {
    method: 'PUT',
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
  const result = await res.json();
  handleApiError(res.status, errorHandler);
  return result;
}

export async function getRasterData(
  id: any,
  errorHandler?: Function
): Promise<any> {
  let result;
  const res = await fetch(
    `${process.env.SITE_IMAGERY_API_URL}/api/v1/project/${id}`
  )
    .then(async (res) => {
      result = res.status === 200 ? await res.json() : null;
      handleApiError(res.status, errorHandler);
      return result;
    })
    .catch((err) => console.log(`Something went wrong: ${err}`));
  return result;
}
