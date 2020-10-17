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

