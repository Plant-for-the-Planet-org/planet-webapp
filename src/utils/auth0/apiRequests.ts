//  API call to private /profile endpoint
export async function getAccountInfo(token:any) {
    const response = await fetch(
        `${process.env.API_ENDPOINT}/app/profile`,
        {
          headers: {
            Authorization: `OAuth ${token}`,
          },
          method: 'GET',
        }
    );
    return response;
}