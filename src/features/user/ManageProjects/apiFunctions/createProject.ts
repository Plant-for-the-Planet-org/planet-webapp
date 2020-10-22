import getsessionId from "../../../../utils/apiRequests/getSessionId";

interface GeoLocationProps {
    type: String,
    coordinates: any
}

interface Props {
    name: String,
    slug: String,
    classification: String,
    geometry: GeoLocationProps,
    countTarget: Number,
    webSite: String,
    description: String,
    acceptDonations: Boolean,
    treeCost: Number,
    currency: String,
    visitorAssistance: Boolean,
    publish: Boolean,
    enablePlantLocations: Boolean
}
export async function createProject(data: Props,session:any) {

    const res = await fetch(`${process.env.API_ENDPOINT}/app/projects`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'tenant-key': `${process.env.TENANTID}`,
            'X-SESSION-ID': await getsessionId(),
            'Authorization': `OAuth ${session.accessToken}`,
            'x-locale': `${localStorage.getItem('language') !== null
                    ? localStorage.getItem('language')
                    : 'en'
                }`,
        },
    });
    const project = await res.json();
    console.log('project', project);

    return project;
}