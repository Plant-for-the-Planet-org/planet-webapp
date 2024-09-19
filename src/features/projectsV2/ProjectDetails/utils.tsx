import { ParsedUrlQuery } from 'querystring';
const paramsToPreserve = [
  'embed',
  'back_icon',
  'callback',
  'project_details',
  'project_list',
  'enable_intro',
];
const paramsToDelete = ['locale', 'slug', 'p'];

/**
 * Updates and returns a query object for a URL based on the current path and specified parameters.
 * It preserves selected query parameters, removes unwanted ones, and adds or updates the site parameter.
 * @param asPath
 * @param query
 * @param siteId
 * @returns An updated query object with preserved, removed, and new parameter
 */

export const updateUrlWithParams = (
  asPath: string,
  query: ParsedUrlQuery,
  siteId: string
) => {
  const [, queryString] = asPath.split('?');
  const currentUrlParams = new URLSearchParams(queryString || '');
  const currentQuery = { ...query };
  paramsToPreserve.forEach((param) => {
    if (currentUrlParams.has(param)) {
      currentQuery[param] = currentUrlParams.get(param) ?? '';
    }
  });
  paramsToDelete.forEach((param) => delete currentQuery[param]);
  //add project site param
  currentQuery.site = siteId;
  return currentQuery;
};
