import getsessionId from "./getSessionId";

export async function getRequest(url: any) {
  let result;
  return new Promise(async (resolve, reject) => {
    await fetch(`${process.env.API_ENDPOINT}` + url, {
      headers: {
        'tenant-key': `${process.env.TENANTID}`,
        'X-SESSION-ID': await getsessionId()
      },
    }).then(async(res) => {
      result = res.status === 200 ? await res.json() : null;
      if (res.status === 404){
        const errorMessage = 'Not Found';
        window.location.href = `/404?error=${errorMessage}`;
      } else if (res.status !== 200) {
        // Maybe show a Modal with Error and redirect to home page
        const errorMessage = res.statusText;
        window.location.href = `/404?error=${errorMessage}`;
      } else {
        resolve(result);
        // return result;
      }
      resolve(result);
    })
    .catch((err) => {
      reject(err);
      console.log(`Something went wrong: ${err}`)
    });
  })
}

export async function getAuthenticatedRequest(url: any,session:any) {
  let result= {};
  await fetch(`${process.env.API_ENDPOINT}` + url, {
      headers: {
        'tenant-key': `${process.env.TENANTID}`,
        'X-SESSION-ID': await getsessionId(),
        'Authorization': `OAuth ${session.accessToken}`,
      },
    }, ).then(async(res) => {
      result = res.status === 200 ? await res.json() : null;
      if(res.status === 404){
        let error = {
          status: 404
        }
        result = error;
      } else if(res.status === 401) {
        let error = {
          status: 401
        }
        result = error;
      }
      else if (res.status !== 200) {
        // Maybe show a Modal with Error and redirect to home page
       
      } else{
        return result;
      }
    })
    .catch((err) => console.log(`Something went wrong: ${err}`));
  return result;
}


export async function postAuthenticatedRequest(url:any,data:any,session:any) {

  const res = await fetch(process.env.API_ENDPOINT + url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json',
          'tenant-key': `${process.env.TENANTID}`,
          'X-SESSION-ID': await getsessionId(),
          'Authorization': `OAuth ${session.accessToken}`,
          'x-locale': `${localStorage.getItem('language')
                  ? localStorage.getItem('language')
                  : 'en'
              }`,
      },
  });
  const result = await res.json();
  return result;
}

export async function deleteAuthenticatedRequest(url:any,session:any) {
  let result;
   await fetch(process.env.API_ENDPOINT + url, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'tenant-key': `${process.env.TENANTID}`,
          'X-SESSION-ID': await getsessionId(),
          'Authorization': `OAuth ${session.accessToken}`,
          'x-locale': `${localStorage.getItem('language')
                  ? localStorage.getItem('language')
                  : 'en'
              }`,
      },
  }).then(res =>{
    result = res.status;
  });
  return result;
}

export async function putAuthenticatedRequest(url:any,data:any,session:any) {

  const res = await fetch(process.env.API_ENDPOINT + url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json',
          'tenant-key': `${process.env.TENANTID}`,
          'X-SESSION-ID': await getsessionId(),
          'Authorization': `OAuth ${session.accessToken}`,
          'x-locale': `${localStorage.getItem('language')
                  ? localStorage.getItem('language')
                  : 'en'
              }`,
      },
  });
  const result = await res.json();
  return result;
}