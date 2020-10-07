import getsessionId from "../../getSessionId";

export async function getTenantScore() {
    let newTenantScore;
    await fetch(`${process.env.API_ENDPOINT}/app/tenantScore`, {
        headers: { 'tenant-key': `${process.env.TENANTID}`, 'X-SESSION-ID': await getsessionId() },
    })
        .then(async (res) => {
            newTenantScore = res.status === 200 ? await res.json() : null;
            if (res.status !== 200) {
                return '404';
            }
            return newTenantScore;
        })
        .catch((err) => console.log(`Something went wrong: ${err}`));
    return newTenantScore;

}