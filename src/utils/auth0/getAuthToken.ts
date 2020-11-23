async function getAuthToken() {
    let data;
    const bodyToSend = {
        "client_id":process.env.AUTH0_CLIENT_ID,
        "client_secret":process.env.AUTH0_CLIENT_SECRET,
        "audience":"https://pftp.eu.auth0.com/api/v2/",
        "grant_type":"client_credentials"
    }
    const response = await fetch(
        `https://pftp.eu.auth0.com/oauth/token`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyToSend)
        },
      ).then(res=> 
        data = res.json()
      );
    return data;
}

export default getAuthToken
