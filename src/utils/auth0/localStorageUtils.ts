/* USER-EXISTS-IN-DB UTILS */

//   fetches if userExistsInDB from the local storage
//  @returns boolean - if user exists in our backend
export function getUserExistsInDB() {
  if (localStorage.getItem('userExistsInDB')) {
    const stringUserExistsInDB = localStorage.getItem('userExistsInDB');
    const userExistsInDB = JSON.parse(stringUserExistsInDB);
    return userExistsInDB;
  }
  return null;
}

//  sets userExistsInDB to the local storage
export function setUserExistsInDB(ifExistsBoolean:boolean) {
    localStorage.setItem('userExistsInDB', JSON.stringify(ifExistsBoolean));
}

//  removes userExistsInDB from local storage
export function removeUserExistsInDB() {
    localStorage.removeItem('userExistsInDB');
}

/* USER INFO */

//  gets userType from the local storage
export function getUserInfo() {
  if (localStorage.getItem('userInfo')) {
    const stringUserInfo = localStorage.getItem('userInfo');
    const userInfo = JSON.parse(stringUserInfo);
    return userInfo;
  }
  return null;
}

//  sets userType to the local storage
export function setUserInfo(userInfo:any) {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

//  removes userInfo from local storage
export function removeUserInfo() {
  localStorage.removeItem('userInfo');
}