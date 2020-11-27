import { getAccountInfo } from "./apiRequests";
import { setUserExistsInDB } from "./localStorageUtils";

// Use a global to save the user, so we don't have to fetch it again after page navigations
let userInfo: any;

export async function getUserInfo(token: any, router: any, logout: any) {  
  // Check if userInfo is present in the global or not
  if (!userInfo) {
    if (localStorage.getItem('userInfo')) {
      const stringUserInfo = localStorage.getItem('userInfo');
      userInfo = JSON.parse(stringUserInfo!);
    }
    else {
      const res = await getAccountInfo(token);

      if (res.status === 200) {
        const resJson = await res.json();
        userInfo = {
          slug: resJson.slug,
          profilePic: resJson.image,
          type: resJson.type
        }
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

      } else if (res.status === 303) {
        setUserExistsInDB(false)
        if (typeof window !== 'undefined') {
          router.push('/complete-signup');
        }
      } else if (res.status === 401) {
        logout();
        if (typeof window !== 'undefined') {
          router.push('/');
        }
        localStorage.removeItem('userInfo');
      } else {
        logout();
        if (typeof window !== 'undefined') {
          router.push('/404');
        }
      }
    }
  }

  return userInfo;
}