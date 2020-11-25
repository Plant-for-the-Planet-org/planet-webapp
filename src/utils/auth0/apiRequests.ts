//  API call to private PUT /profile endpoint
export async function editProfile(session:any, bodyToSend:any) {
    const response = await fetch(
        `${process.env.API_ENDPOINT}/app/profile`, {
          method: 'PUT',
          headers: { 
            'Authorization': `OAuth ${session.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyToSend)
        },
      );
    return response;
}

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