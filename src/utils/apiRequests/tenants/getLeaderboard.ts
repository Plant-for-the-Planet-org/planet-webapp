import getsessionId from "../../getSessionId";

export async function getLeaderboard() {
    let newLeaderboard;
    await fetch(`${process.env.API_ENDPOINT}/app/leaderboard`, {
        headers: { 'tenant-key': `${process.env.TENANTID}`, 'X-SESSION-ID': await getsessionId()  },
      })
        .then(async (res) => {
          newLeaderboard = res.status === 200 ? await res.json() : null;
          if (res.status !== 200) {
            return '404';
          }
          return newLeaderboard;
        })
        .catch((err) => console.log(`Something went wrong: ${err}`));
    return newLeaderboard;

}