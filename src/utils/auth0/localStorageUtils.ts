// Fetches user slug from the local storage
// @returns string - user-slug of logged-in user
export function getUserSlug() {
  if (localStorage.getItem('userSlug')) {
    const stringUserSlug = localStorage.getItem('userSlug');
    const userSlug = JSON.parse(stringUserSlug);
    return userSlug;
  }
  return null;
}

//   sets userSlug to the local storage
export function setUserSlug(userslug:string) {
    localStorage.setItem('userSlug', JSON.stringify(userslug));
}

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

//  removes userSlug from local storage
export function removeUserSlug() {
    localStorage.removeItem('userSlug');
}
