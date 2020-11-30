import getsessionId from './apiRequests/getSessionId';

export default async function storeConfig(){
  return new Promise((resolve, reject) => {
    fetch(`${process.env.API_ENDPOINT}/public/v1.2/en/config`, {
      headers: {
        'tenant-key': `${process.env.TENANTID}`,
        'X-SESSION-ID': getsessionId(),
      },
    }).then(async (res) => {
      const config = await res.json();
      localStorage.setItem('config', JSON.stringify(config));
      if (!localStorage.getItem('countryCode')) {
        localStorage.setItem('countryCode', config.country);
      }
      if (!localStorage.getItem('currencyCode')) {
        localStorage.setItem('currencyCode', config.currency);
      }
      resolve();
    }).catch((err) => {
      console.log(`Something went wrong: ${err}`)
      reject(err);
    })
  })
  }