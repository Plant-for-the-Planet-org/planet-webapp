import getsessionId from '../getSessionId';
import getStoredCurrency from '../getStoredCurrency';

export async function getAllProjects() {
    let currencyCode = getStoredCurrency();
    let fetchedProjects;
    await fetch(
        `${process.env.API_ENDPOINT}/app/projects?_scope=map&currency=${currencyCode}`,
        {
            headers: { 'tenant-key': `${process.env.TENANTID}`, 'X-SESSION-ID': await getsessionId() },
        }
    )
        .then(async (res) => {
            fetchedProjects = res.status === 200 ? await res.json() : null;
            if (res.status !== 200) {
                return '404';
            }
            return fetchedProjects;
        })
        .catch((err) => console.log(`Something went wrong: ${err}`));
    return fetchedProjects;
}