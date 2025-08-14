import type {
  ProjectSite,
  TreeProjectClassification,
} from '@planet-sdk/common';
import type { MapGeoJSONFeature, PointLike } from 'react-map-gl-v7/maplibre';
import type { Feature, MultiPolygon, Polygon, Position } from 'geojson';
import type { ParsedUrlQuery } from 'querystring';
import type {
  MapRef,
  MapProjectProperties,
  ExtendedProject,
  MapProject,
  ProjectSiteFeature,
} from '../features/common/types/projectv2';
import type {
  Intervention,
  SingleTreeRegistration,
  OtherInterventions,
  SampleTreeRegistration,
} from '../features/common/types/intervention';
import type { SitesGeoJSON } from '../features/common/types/ProjectPropsContextInterface';

import * as turf from '@turf/turf';

interface MetaDataValue {
  value: string;
  label: string;
}

interface PublicMetaData {
  [key: string]: string | MetaDataValue;
}

export type MobileOs = 'android' | 'ios' | undefined;

const paramsToDelete = ['ploc', 'backNavigationUrl', 'site'];
const nonDisplayPublicMetadataKeys = ['isEntireSite'];

export const MAIN_MAP_LAYERS = {
  SATELLITE_LAYER: 'satellite-layer',
  PLANT_POLYGON: 'plant-polygon-layer',
  PLANT_POINT: 'point-layer',
  SITE_POLYGON: 'site-polygon-fill-layer',
  SITE_POLYGON_LINE: 'site-polygon-line-layer',
  SELECTED_LINE: 'line-selected',
  DATE_DIFF_LABEL: 'datediff-label',
};

export const PLANT_LAYERS = [
  MAIN_MAP_LAYERS.PLANT_POLYGON,
  MAIN_MAP_LAYERS.PLANT_POINT,
];

export const INTERACTIVE_LAYERS = [
  MAIN_MAP_LAYERS.PLANT_POLYGON,
  MAIN_MAP_LAYERS.PLANT_POINT,
  MAIN_MAP_LAYERS.SITE_POLYGON,
];

export const MAIN_MAP_ANIMATION_DURATIONS = {
  ZOOM_OUT: 1600,
  ZOOM_IN: 4000,
} as const;

type RouteParams = {
  siteId?: string | null;
  plocId?: string | null;
};

/** Type predicate to check that the property contains a string value*/
const isStringValue = (entry: [string, unknown]): entry is [string, string] => {
  return typeof entry[1] === 'string';
};

/** Type guard that checks if a value is a non-array object containing a string `value` property. */
function isObjectWithStringValue(obj: unknown): obj is { value: string } {
  return (
    !!obj &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    'value' in obj &&
    typeof (obj as { value: unknown }).value === 'string'
  );
}

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
 * Returns all rendered features at the given point on the map, limited to specific layers.
 *
 * Important:
 * - The order of features in the returned array reflects the visual stacking order of layers.
 * - The topmost (last drawn) layer in the style stack will appear first in the array.
 *
 * Example:
 * If the layers are added in this order:
 *   1. "site-polygon-fill-layer" (bottom)
 *   2. "plant-polygon-layer" (middle)
 *   3. "point-layer" (top)
 *
 * Then:
 *   - If all 3 features overlap at the click point:
 *       features[0] => point-layer feature (topmost)
 *       features[1] => plant-polygon-layer feature
 *       features[2] => site-polygon-fill-layer feature (bottommost)
 *   - If only site and plant polygons are under the point:
 *       features[0] => plant-polygon-layer feature
 *       features[1] => site-polygon-fill-layer feature
 *
 * Use this order to determine which feature the user is most likely interacting with visually.
 *
 * @param mapRef - Ref to the MapLibre map instance
 * @param point - The screen coordinate (e.point) to query
 * @returns An array of features under the point, or undefined if the map is not ready. Returns an empty array if no features are found.
 */

export function getFeaturesAtPoint(mapRef: MapRef, point: PointLike) {
  if (!mapRef.current) return;
  const map = mapRef.current.getMap();

  const features = map.queryRenderedFeatures(point, {
    layers: INTERACTIVE_LAYERS,
  });

  if (features.length === 0) {
    map.getCanvas().style.cursor = '';
    return [];
  }

  map.getCanvas().style.cursor = 'pointer';
  return features;
}

/**
 * Finds the index of the site in the sites array that matches the feature under the cursor.
 *
 * This is used to detect which site polygon the user interacted with.
 *
 * @param sites - The array of site GeoJSON features (polygons or multipolygons)
 * @param features - The array of rendered features returned by queryRenderedFeatures
 * @returns The index of the matching site in the `sites` array, or -1 if not found
 */

export const getSiteIndex = (
  sites: Feature<Polygon | MultiPolygon, ProjectSite>[],
  features: MapGeoJSONFeature[]
) => {
  const siteFeature = features.find(
    (f) => f.layer.id === MAIN_MAP_LAYERS.SITE_POLYGON
  );
  if (!siteFeature) return -1;

  return sites.findIndex(
    (site) => site.properties.id === siteFeature.properties.id
  );
};

/**
 * Retrieves the matching intervention based on the topmost hovered map feature.
 *
 * This function checks whether the topmost feature in the provided feature list
 * corresponds to a valid intervention layer (as defined by `PLANT_LAYERS`) and,
 * if so, finds and returns the intervention with a matching `id`.
 *
 * @param {Intervention[] | null} interventions - The list of intervention objects to match against.
 * @param {MapGeoJSONFeature[]} features - An array of GeoJSON features returned from a map hover or click event.
 * @returns {Intervention | undefined} The matched intervention if found, or `undefined` if no match exists or input is invalid.
 */

export const getInterventionInfo = (
  interventions: Intervention[] | null,
  features: MapGeoJSONFeature[]
): Intervention | undefined => {
  if (!interventions || interventions.length === 0 || features.length === 0)
    return;

  const topmostFeature = features[0]; // top layer
  const layerId = topmostFeature.layer.id;
  const isPlantLayer = PLANT_LAYERS.includes(layerId);
  if (!isPlantLayer) return;

  return interventions.find(
    (intervention) => intervention.id === topmostFeature.properties.id
  );
};

export const formatHid = (hid: string | undefined) => {
  return hid ? hid.slice(0, 3) + '-' + hid.slice(3) : null;
};

export const getActiveSingleTree = (
  selected: Intervention | null,
  hovered: Intervention | null,
  selectedSample: SampleTreeRegistration | null
): SingleTreeRegistration | SampleTreeRegistration | undefined => {
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
  if (cleanPath === '' || cleanPath === '/' || cleanPath === `/${locale}`) {
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

/**
 * Returns a GeoJSON FeatureCollection from a list of site features.
 * Filters out features without valid geometry.
 *
 * @param sites - Array of project site features with geometry.
 * @returns GeoJSON FeatureCollection with valid features only.
 */
export function getSitesGeoJson(sites: ProjectSiteFeature[]): SitesGeoJSON {
  return {
    type: 'FeatureCollection',
    features: sites.filter((site) => !!site.geometry),
  };
}

/**
 * Safely parses a JSON string into a JavaScript value without throwing errors.
 *
 * @param {string} str - The JSON string to parse.
 * @returns {unknown | null} - The parsed value if valid JSON, otherwise `null`.
 */
function tryParseJson(str: string): unknown | null {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

/**
 * Formats a single metadata entry into a user-facing key-value pair.
 *
 * Rules:
 * - Skips entries whose keys are in `nonDisplayPublicMetadataKeys`.
 * - Accepts direct string values.
 * - Accepts objects with `value` and `label` properties.
 * - If `value` is a JSON string, attempts to parse it and extract a nested string `value`.
 *
 * @param {string} metaKey - The metadata property name.
 * @param {unknown} metaValue - The metadata property value.
 * @returns {{ key: string; value: string } | null} - The formatted metadata entry, or `null` if not displayable.
 */
function formatMetadataEntry(metaKey: string, metaValue: unknown) {
  if (nonDisplayPublicMetadataKeys.includes(metaKey)) return null;

  if (typeof metaValue === 'string') {
    return { key: metaKey, value: metaValue };
  }

  if (
    !metaValue ||
    typeof metaValue !== 'object' ||
    !('value' in metaValue) ||
    !('label' in metaValue)
  ) {
    return null;
  }

  const parsedValue =
    typeof metaValue.value === 'string' ? tryParseJson(metaValue.value) : null;

  return {
    key: metaValue.label,
    value: isObjectWithStringValue(parsedValue)
      ? parsedValue.value
      : metaValue.value,
  };
}

/**
 * Determines if the provided value is a valid `PublicMetaData` object.
 *
 * @param {unknown} metadata - The value to check.
 * @returns {metadata is PublicMetaData} - `true` if `metadata` is a non-array object.
 */
function isValidPublicMetadata(metadata: unknown): metadata is PublicMetaData {
  return !!metadata && typeof metadata === 'object' && !Array.isArray(metadata);
}

/**
 * Extracts and formats the `metadata.public` section of an intervention info
 * an array of display-friendly key-value pairs.
 *
 * @param {OtherInterventions | null} interventionInfo - The intervention object containing public metadata.
 * @returns {{ key: string; value: string }[]} - Array of displayable metadata entries.
 */
export function prepareInterventionMetadata(
  interventionInfo: OtherInterventions | null
) {
  const publicMetadata = interventionInfo?.metadata?.public;
  if (!isValidPublicMetadata(publicMetadata)) return [];

  return Object.entries(publicMetadata)
    .map(([key, value]) => formatMetadataEntry(key, value))
    .filter((entry): entry is { key: string; value: string } => !!entry);
}
