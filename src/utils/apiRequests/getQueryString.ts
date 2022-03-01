export const getQueryString = (queryParams: { [key: string]: string }) => {
  return Object.keys(queryParams)
    .map((key) => {
      return `${key}=${queryParams[key]}`;
    })
    .join('&');
};
