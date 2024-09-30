import { TreeProjectClassification } from '@planet-sdk/common';
import { MapRef, PointLike } from 'react-map-gl-v7/maplibre';
import { MutableRefObject } from 'react';
import { ParsedUrlQuery } from 'querystring';
import {
  MapProjectProperties,
  ExtendedProject,
} from '../features/common/types/projectv2';
import { PlantLocation } from '../features/common/types/plantLocation';

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
    layers: ['plant-polygon-layer'],
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
