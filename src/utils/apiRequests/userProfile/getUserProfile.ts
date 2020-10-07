import getsessionId from "../../getSessionId";

export async function getUserProfile(slug:any) {
    let newPublicUserprofile;
    const res = await fetch(
        `${process.env.API_ENDPOINT}/public/v1.0/en/treecounter/${slug}`,
        {
          headers: { 'tenant-key': `${process.env.TENANTID}`, 'X-SESSION-ID': await getsessionId()  },
        }
      );
      if (res.ok === false) {
          return '404';
      } else {
      newPublicUserprofile = await res.json();
      }
    return newPublicUserprofile;

}