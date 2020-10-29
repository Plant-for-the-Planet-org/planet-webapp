/* USER-SLUG UTILS */

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

//  removes userSlug from local storage
export function removeUserSlug() {
  localStorage.removeItem('userSlug');
}


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

/* USER PROFILE PIC */

//  gets userProfilePic from the local storage
export function getUserProfilePic() {
  if (localStorage.getItem('userProfilePic')) {
    const stringUserProfilePic = localStorage.getItem('userProfilePic');
    const userProfilePic = JSON.parse(stringUserProfilePic);
    return userProfilePic;
  }
  return null;
}

//  sets userProfilePic to the local storage
export function setUserProfilePic(userProfilePic) {
  localStorage.setItem('userProfilePic', JSON.stringify(userProfilePic));
}

//  removes userProfilePic from local storage
export function removeUserProfilePic() {
  localStorage.removeItem('userProfilePic');
}

/* USER TYPE */

//  gets userType from the local storage
export function getUserType() {
  if (localStorage.getItem('userType')) {
    const stringUserType = localStorage.getItem('userType');
    const userType = JSON.parse(stringUserType);
    return userType;
  }
  return null;
}

//  sets userType to the local storage
export function setUserType(userType) {
  localStorage.setItem('userType', JSON.stringify(userType));
}

//  removes userType from local storage
export function removeUserType() {
  localStorage.removeItem('userType');
}