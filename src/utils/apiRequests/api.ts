import getsessionId from './getSessionId';

//  API call to private /profile endpoint
export async function getAccountInfo(token: any) {
  const response = await fetch(`${process.env.API_ENDPOINT}/app/profile`, {
    method: 'GET',
    headers: {
      'tenant-key': `${process.env.TENANTID}`,
      'X-SESSION-ID': await getsessionId(),
      Authorization: `OAuth ${token}`,
      'x-locale': `${
        localStorage.getItem('language')
          ? localStorage.getItem('language')
          : 'en'
      }`,
    },
  });
  return response;
}

export async function getRequest(url: any) {
  let result;
  await fetch(`${process.env.API_ENDPOINT}` + url, {
    method: 'GET',
    headers: {
      'tenant-key': `${process.env.TENANTID}`,
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
      if (res.status === 404) {
        const errorMessage = 'Not Found';
        window.location.href = `/404?error=${errorMessage}`;
      } else if (res.status !== 200) {
        // Maybe show a Modal with Error and redirect to home page
        const errorMessage = res.statusText;
        window.location.href = `/404?error=${errorMessage}`;
      } else {
        return result;
      }
    })
    .catch((err) => console.log(`Something went wrong: ${err}`));
  return result;
}

export async function getAuthenticatedRequest(url: any, token: any) {
  let result = {};
  await fetch(`${process.env.API_ENDPOINT}` + url, {
    method: 'GET',
    headers: {
      'tenant-key': `${process.env.TENANTID}`,
      'X-SESSION-ID': await getsessionId(),
      Authorization: `OAuth ${token}`,
      'x-locale': `${
        localStorage.getItem('language')
          ? localStorage.getItem('language')
          : 'en'
      }`,
    },
  })
    .then(async (res) => {
      result = res.status === 200 ? await res.json() : null;
      if(res.status === 404){
        const error = {
          status: 404
        }
        result = error;
      } else if(res.status === 401) {
        const error = {
          status: 401
        }
        result = error;
      } else if (res.status !== 200) {
        // Maybe show a Modal with Error and redirect to home page
      } else {
        return result;
      }
    })
    .catch((err) => console.log(`Something went wrong: ${err}`));
  return result;
}

export async function postAuthenticatedRequest(
  url: any,
  data: any,
  token: any
) {
  const res = await fetch(process.env.API_ENDPOINT + url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'tenant-key': `${process.env.TENANTID}`,
      'X-SESSION-ID': await getsessionId(),
      Authorization: `OAuth ${token}`,
      'x-locale': `${
        localStorage.getItem('language')
          ? localStorage.getItem('language')
          : 'en'
      }`,
    },
  });
  const result = await res.json();
  return result;
}

export async function postRequest(url: any, data: any) {
  const res = await fetch(process.env.API_ENDPOINT + url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'tenant-key': `${process.env.TENANTID}`,
      'X-SESSION-ID': await getsessionId(),
      'x-locale': `${
        localStorage.getItem('language')
          ? localStorage.getItem('language')
          : 'en'
      }`,
    },
  });
  const result = await res.json();
  return result;
}

export async function deleteAuthenticatedRequest(url: any, token: any) {
  let result;
  await fetch(process.env.API_ENDPOINT + url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'tenant-key': `${process.env.TENANTID}`,
      'X-SESSION-ID': await getsessionId(),
      Authorization: `OAuth ${token}`,
      'x-locale': `${
        localStorage.getItem('language')
          ? localStorage.getItem('language')
          : 'en'
      }`,
    },
  }).then((res) => {
    result = res.status;
  });
  return result;
}

export async function putAuthenticatedRequest(url: any, data: any, token: any) {
  const res = await fetch(process.env.API_ENDPOINT + url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'tenant-key': `${process.env.TENANTID}`,
      'X-SESSION-ID': await getsessionId(),
      Authorization: `OAuth ${token}`,
      'x-locale': `${
        localStorage.getItem('language')
          ? localStorage.getItem('language')
          : 'en'
      }`,
    },
  });
  const result = await res.json();
  return result;
}

export async function getRasterData(id: any) {
  let result;
  const res = await fetch(`${process.env.SITE_IMAGERY_API_URL}/api/v1/project/${id}`)
    .then(async (res) => {
      result = res.status === 200 ? await res.json() : null;
      return result;
    })
    .catch((err) => console.log(`Something went wrong: ${err}`));
  return result;
}

export async function getRequestWithoutRedirecting(url: any) {
  let result;
  await fetch(`${process.env.API_ENDPOINT}` + url, {
    headers: {
      'tenant-key': `${process.env.TENANTID}`,
      'X-SESSION-ID': await getsessionId(),
      'x-locale': `${
        localStorage.getItem('language')
          ? localStorage.getItem('language')
          : 'en'
      }`,
    },
  })
    .then(async (res) => {
      result = res.status === 200 ? await res.json() : res.status;
      return result;
    })
    .catch((err) => console.log(`Something went wrong: ${err}`));
  return result;
}
