import { TreeProjectClassification } from '@planet-sdk/common';
import { MapRef, PointLike } from 'react-map-gl-v7/maplibre';
import { MutableRefObject } from 'react';
import { ParsedUrlQuery } from 'querystring';
import {
  MapProjectProperties,
  ExtendedProject,
} from '../features/common/types/projectv2';
import {
  PlantLocation,
  PlantLocationSingle,
  SamplePlantLocation,
} from '../features/common/types/plantLocation';

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
  siteId: string | null
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
  if (siteId) currentQuery.site = siteId;
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
