import getsessionId from "./getSessionId";

export default async function getRequest(url: any) {
  let result;
  await fetch(`${process.env.API_ENDPOINT}` + url, {
      headers: {
        'tenant-key': `${process.env.TENANTID}`,
        'X-SESSION-ID': await getsessionId()
      },
    }, ).then(async(res) => {
      result = res.status === 200 ? await res.json() : null;
      if (res.status !== 200) {
        return '404';
      }
      return result;
    })
    .catch((err) => console.log(`Something went wrong: ${err}`));
  return result;
}
