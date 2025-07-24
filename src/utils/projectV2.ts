import type { TreeProjectClassification } from '@planet-sdk/common';
import type { PointLike } from 'react-map-gl-v7/maplibre';
import type { Position } from 'geojson';
import type { ParsedUrlQuery } from 'querystring';
import type {
  MapRef,
  MapProjectProperties,
  ExtendedProject,
  MapProject,
} from '../features/common/types/projectv2';
import type {
  Intervention,
  InterventionSingle,
  SampleIntervention,
} from '../features/common/types/intervention';

import * as turf from '@turf/turf';

export type MobileOs = 'android' | 'ios' | undefined;

const paramsToDelete = ['ploc', 'backNavigationUrl', 'site'];

type RouteParams = {
  siteId?: string | null;
  plocId?: string | null;
};

/** Type predicate to check that the property contains a string value*/
const isStringValue = (entry: [string, unknown]): entry is [string, string] => {
  return typeof entry[1] === 'string';
};

/**
 * Updates and returns a query object for a URL based on the current path and specified parameters.
 * It preserves selected query parameters, removes unwanted ones, and adds or updates the site parameter.
 * @param asPath
 * @param query
 * @param siteId
 * @returns An updated query object with preserved, removed, and new parameter
 */

export const buildProjectDetailsQuery = (
  query: ParsedUrlQuery,
  routeParams: RouteParams
): Record<string, string> => {
  // Convert ParsedUrlQuery to Record<string, string> by filtering out non-string values
  const currentQuery: Record<string, string> = Object.fromEntries(
    Object.entries(query).filter(isStringValue)
  );

  // Preserve and delete query parameters
  paramsToDelete.forEach((param) => delete currentQuery[param]);

  // Add routing params if provided
  if (routeParams.siteId) {
    currentQuery.site = routeParams.siteId;
  }

  if (routeParams.plocId) {
    currentQuery.ploc = routeParams.plocId;
  }

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

export const isValidClassification = (
  value: string
): value is TreeProjectClassification => {
  return availableFilters.includes(value as TreeProjectClassification);
};

/**
 * Retrieves the information of a plant location based on a user's interaction with the map.
 *
 * @param {Intervention[]} plantLocations - Array of plant location data or null.
 * @param {MutableRefObject<MapRef>} mapRef - A reference to the map instance.
 * @param {PointLike} point - The screen coordinates (PointLike) where the user interacted with the map.
 *
 * The function works as follows:
 * - It first checks if the map instance and plant locations are available.
 * - Using `queryRenderedFeatures`, it retrieves all map features (polygon and point layers) at the given point.
 * - If more than one feature is returned (indicating overlap of Polygon), the hover effect is disabled by resetting the cursor.
 * - If exactly one feature is returned, the hover effect is enabled (cursor changes to a pointer),
 *   and the corresponding plant location information is returned.
 * - If no features are returned, the cursor is reset to the default, and no plant location is returned.
 */

export const getPlantLocationInfo = (
  plantLocations: Intervention[] | null,
  mapRef: MapRef,
  point: PointLike
) => {
  if (!mapRef.current || plantLocations?.length === 0) {
    return;
  }
  const map = mapRef.current.getMap();
  const features = map.queryRenderedFeatures(point, {
    layers: ['plant-polygon-layer', 'point-layer'],
  });
  if (features.length > 1) {
    map.getCanvas().style.cursor = '';
    return;
  }

  if (features.length === 1) {
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

export const getPlantData = (
  selected: Intervention | null,
  hovered: Intervention | null,
  selectedSample: SampleIntervention | null
): InterventionSingle | SampleIntervention | undefined => {
  if (selected?.type === 'single-tree-registration') return selected;
  if (hovered?.type === 'single-tree-registration') return hovered;
  if (selectedSample?.type === 'sample-tree-registration')
    return selectedSample;
  return undefined;
};

const isValidCoordinate = (coord: Position) =>
  Array.isArray(coord) &&
  coord.length === 2 &&
  typeof coord[0] === 'number' &&
  typeof coord[1] === 'number';

/**
 * Filters a list of project features to include only those with valid coordinates.
 * A project feature is considered valid if its geometry.
 * coordinates array contains exactly two numbers (longitude and latitude)
 * @param {MapProject[]} projects
 * @returns
 */
export const getValidFeatures = (projects: MapProject[]) =>
  projects?.filter((feature) =>
    isValidCoordinate(feature.geometry.coordinates)
  ) ?? [];

/**
 * Calculates the centroid (geometric center) of a collection of project features.
 * The features are converted into a GeoJSON FeatureCollection, and the centroid is calculated using Turf.js.
 * @param {MapProject[]} features
 * @returns
 */
export const calculateCentroid = (features: MapProject[]) => {
  const featureCollection = {
    type: 'FeatureCollection',
    features,
  };
  return turf.centroid(featureCollection);
};

/**
 *  Centers the map on a given longitude and latitude using a smooth transition (animated).
 *  It uses the MapLibre easeTo method for map animation with a custom easing function
 * @param mapRef
 * @param param1
 * @returns
 */
export const centerMapOnCoordinates = (
  mapRef: MapRef,
  [longitude, latitude]: Position
) => {
  if (!mapRef.current) return;
  mapRef.current.getMap().easeTo({
    center: [longitude, latitude],
    duration: 1200,
    easing: (t) => t * (2 - t),
  });
};

export const generateProjectLink = (
  projectGuid: string,
  routerAsPath: string, //e.g. /en/yucatan, /en
  locale: string //e.g. en
) => {
  const nonLocalizedPath =
    routerAsPath === `/${locale}`
      ? '/'
      : routerAsPath.replace(`/${locale}`, '');
  return `/${projectGuid}?backNavigationUrl=${encodeURIComponent(
    nonLocalizedPath
  )}`;
};

/**
 * Compares the coordinates of the map center with the centroid coordinates to determine if they are approximately equal.
 *
 * @param mapCenter - The center coordinates of the map, containing longitude (`lng`) and latitude (`lat`). Can be `undefined`.
 * @param centroidCoords - The centroid coordinates as a tuple containing longitude and latitude.
 * @param epsilon - The threshold for determining equality, representing a very small difference (default is 0.00009, which corresponds to approximately 10 meters at the Equator).
 * @returns `true` if the coordinates are approximately equal within the specified threshold, otherwise `false`.
 */
export const areMapCoordsEqual = (
  mapCenter: { lng: number; lat: number } | undefined,
  centroidCoords: Position,
  epsilon = 0.00009 // Very small difference threshold corresponding to 10m at Equator
): boolean => {
  if (mapCenter === undefined) return false;
  return (
    Math.abs(mapCenter.lng - centroidCoords[0]) < epsilon &&
    Math.abs(mapCenter.lat - centroidCoords[1]) < epsilon
  );
};

/**
 * Takes a relative path and returns a localized version with the correct locale prefix.
 * Query parameters are stripped from the input path.
 * @param path - The relative path to localize
 * @param locale - The current locale (e.g., 'en')
 * @returns The localized path without query parameters
 */
export const getLocalizedPath = (path: string, locale: string): string => {
  // Strip query parameters if present
  const pathWithoutQuery = path.split('?')[0];

  // Remove trailing slash if present
  const cleanPath = pathWithoutQuery.endsWith('/')
    ? pathWithoutQuery.slice(0, -1)
    : pathWithoutQuery;

  // Handle root path special case
  if (cleanPath === '' || cleanPath === '/') {
    return `/${locale}`;
  }

  // If path already contains locale as a segment, return as is
  const pathSegments = cleanPath.split('/').filter(Boolean);
  if (pathSegments[0] === locale) {
    return cleanPath;
  }

  // Remove leading slash if present for consistent handling
  const normalizedPath = cleanPath.startsWith('/')
    ? cleanPath.slice(1)
    : cleanPath;

  // Add locale prefix
  return `/${locale}/${normalizedPath}`;
};

export const getDeviceType = (): MobileOs => {
  const userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) return 'android';
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
  return undefined;
};

/**
 * Checks if the "Firealert Fires" feature is enabled via env variable or query string.
 * @returns boolean, Wheather this feature is enabled or not
 */
export function isFirealertFiresEnabled() {
  const isEnvVariableEnabled =
    process.env.NEXT_PUBLIC_ENABLE_FIREALERT_FIRES?.trim().toLowerCase() ===
    'true';
  const isQueryStringEnabled =
    new URLSearchParams(window.location.search)
      .get('fa-fires')
      ?.toLowerCase() === 'true';

  return isEnvVariableEnabled || isQueryStringEnabled;
}
