import getsessionId from "../getSessionId";
import getStoredCurrency from "../getStoredCurrency";

export async function getSingleProject(id: any) {
    let currencyCode = getStoredCurrency();
    let newProject;
    await fetch(
      `${process.env.API_ENDPOINT}/app/projects/${id}?_scope=extended&currency=${currencyCode}`,
      {
         headers: { 'tenant-key': `${process.env.TENANTID}`, 'X-SESSION-ID': await getsessionId() },
      },
    ).then(async (res) => {
        newProject = res.status === 200 ? await res.json() : null;
        if (res.status !== 200) {
            return '404';
        }
        return newProject;
      })
      .catch((err) => console.log(`Something went wrong: ${err}`));
    return newProject;
  }