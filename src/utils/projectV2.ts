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
  PlantLocation,
  PlantLocationSingle,
  SamplePlantLocation,
} from '../features/common/types/plantLocation';

import * as turf from '@turf/turf';

export type MobileOs = 'android' | 'ios' | undefined;

const paramsToDelete = ['ploc', 'backNavigationUrl', 'site'];

type RouteParams = {
  siteId?: string | null;
  plocId?: string | null;
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
  asPath: string,
  query: ParsedUrlQuery,
  routeParams: RouteParams
): Record<string, string> => {
  console.log('updateUrlWithParams:');
  console.log('  Path:', asPath);
  console.log('  Query:', query);
  console.log('  Route Params:', routeParams);
  // Convert ParsedUrlQuery to Record<string, string> by filtering out non-string values
  const currentQuery: Record<string, string> = Object.entries(query).reduce(
    (stringQueryParams, [key, value]) => {
      if (typeof value === 'string') {
        stringQueryParams[key] = value;
      }
      return stringQueryParams;
    },
    {} as Record<string, string>
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

  console.log('updateUrlWithParams: Updated Query Parameters:');
  console.log('  Current Query:', JSON.stringify(currentQuery, null, 2));
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
 * @param {PlantLocation[]} plantLocations - Array of plant location data or null.
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
  plantLocations: PlantLocation[] | null,
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
  selected: PlantLocation | null,
  hovered: PlantLocation | null,
  selectedSample: SamplePlantLocation | null
): PlantLocationSingle | SamplePlantLocation | undefined => {
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
  routerAsPath: string
) => {
  return `/prd/${projectGuid}?backNavigationUrl=${encodeURIComponent(
    routerAsPath
  )}`;
};

export const getDeviceType = (): MobileOs => {
  const userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) return 'android';
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
  return undefined;
};
