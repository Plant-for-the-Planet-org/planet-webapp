//  API call to private /profile endpoint
export async function getAccountInfo(session:any) {
    console.log('------API CALL TO THE BACKEND------');
    const response = await fetch(
        `${process.env.API_ENDPOINT}/treemapper/profile`,
        {
          headers: {
            Authorization: `OAuth ${session.accessToken}`,
          },
          method: 'GET',
        }
    );
    return response;
}