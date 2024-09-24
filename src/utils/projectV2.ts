import { ParsedUrlQuery } from 'querystring';
import {
  MapProjectProperties,
  ExtendedProject,
} from '../features/common/types/projectv2';
import { TreeProjectClassification } from '@planet-sdk/common';

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

/**
 * Determines the category of a project based on its properties.
 * @param {MapProjectProperties | ExtendedProject} projectProperties - The project properties to evaluate.
 * @returns {string} - Returns the category of the project as 'topProject', 'regularProject', or 'nonDonatableProject'.
 */

export const getProjectCategory = (
  projectProperties: MapProjectProperties | ExtendedProject
) => {
  if (
    projectProperties.purpose === 'trees' &&
    projectProperties.isTopProject &&
    projectProperties.isApproved
  ) {
    return 'topProject';
  } else if (projectProperties.allowDonations) {
    return 'regularProject';
  } else {
    return 'nonDonatableProject';
  }
};

export const availableFilters: TreeProjectClassification[] = [
  'large-scale-planting',
  'agroforestry',
  'natural-regeneration',
  'managed-regeneration',
  'urban-planting',
  'mangroves',
  'other-planting',
];
