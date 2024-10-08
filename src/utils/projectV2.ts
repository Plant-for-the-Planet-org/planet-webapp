import { TreeProjectClassification } from '@planet-sdk/common';
import { MapRef, PointLike } from 'react-map-gl-v7/maplibre';
import { MutableRefObject } from 'react';
import { ParsedUrlQuery } from 'querystring';
import {
  MapProjectProperties,
  ExtendedProject,
} from '../features/common/types/projectv2';
import { PlantLocation } from '../features/common/types/plantLocation';
import { NextRouter } from 'next/router';

const paramsToPreserve = [
  'embed',
  'back_icon',
  'callback',
  'project_details',
  'project_list',
  'enable_intro',
];
const paramsToDelete = ['locale', 'slug', 'p', 'ploc'];

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

/**
 * Retrieves the information of a plant location based on a user's interaction with the map.
 *
 * @param plantLocations - Array of plant location data or null.
 * @param mapRef - A reference to the map instance.
 * @param point - The screen coordinates (PointLike) where the user interacted with the map.
 *
 * The function checks if the map instance exists. It then queries the map for features (like plant polygons) at the specified point
 * in the `plant-polygon-layer`. If features are found, it changes the map's cursor to a pointer (indicating interactivity) and
 * attempts to find and return the corresponding plant location from the `plantLocations` array using the feature's properties.
 * If no features are found, it resets the cursor style.
 */

export const getPlantLocationInfo = (
  plantLocations: PlantLocation[] | null,
  mapRef: MutableRefObject<MapRef | null>,
  point: PointLike
) => {
  if (!mapRef.current || plantLocations?.length === 0) {
    return;
  }
  const map = mapRef.current.getMap();
  const features = map.queryRenderedFeatures(point, {
    layers: ['plant-polygon-layer', 'point-layer'],
  });
  if (features && features.length > 0) {
    map.getCanvas().style.cursor = 'pointer';
    const activePlantLocation = plantLocations?.find(
      (pl) => pl.id === features[0].properties.id
    );
    return activePlantLocation;
  } else {
    map.getCanvas().style.cursor = '';
  }
};

export const formatHid = (hid: string | undefined) => {
  return hid ? hid.slice(0, 3) + '-' + hid.slice(3) : null;
};

/**
 *
 *
 * @param {string} locale - The locale or language code (e.g., 'en', 'fr') for the current page.
 * @param {string} projectSlug - The unique identifier or slug for the project.
 * @param {Object} [queryParams={}] - Optional object containing key-value pairs for query parameters that will be added to the URL.
 * @param {NextRouter} router - The Next.js router object used for navigation and URL manipulation.
 *
 */
export const pushWithShallow = (
  locale: string,
  projectSlug: string,
  queryParams = {},
  router: NextRouter
) => {
  const pathname = `/${locale}/prd/${projectSlug}`;
  router?.push({ pathname, query: queryParams }, undefined, {
    shallow: true,
  });
};

/**
 * Updates the current URL with the provided site ID by modifying the query parameters,
 * and then pushes the updated URL using shallow routing.
 * This ensures that the site ID (e.g., `siteId`) is reflected in the URL while keeping the user on the same page.
 *
 * @param {string} locale - The locale or language code (e.g., 'en', 'fr') for the current page.
 * @param {string} projectSlug - The unique identifier or slug for the project.
 * @param {string} siteId - The ID of the site to be added to the query parameters.
 * @param {NextRouter} router - The Next.js router object used for navigation and URL manipulation.
 *
 *
 */

export const updateUrlWithSiteId = (
  locale: string,
  projectSlug: string,
  siteId: string,
  router: NextRouter
) => {
  const updatedQueryParams = updateUrlWithParams(
    router.asPath,
    router.query,
    siteId
  );
  pushWithShallow(locale, projectSlug, updatedQueryParams, router);
};
