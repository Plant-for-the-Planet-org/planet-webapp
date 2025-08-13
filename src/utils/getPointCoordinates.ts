import type { Point, Polygon, Position } from 'geojson';

import centerOfMass from '@turf/center-of-mass';
import { multiPoint } from '@turf/helpers';

/**
 * Converts a GeoJSON Polygon or Point geometry to a Point geometry
 *
 * @param {ContributionsGeoJsonQueryResult} contribution Single contribution from the resulting list of contributionsGeoJson Query
 * @returns {Position} Point Coordinate
 */

const getPointCoordinates = (geometry: Polygon | Point): Position => {
  if (geometry.type === 'Polygon') {
    const polygonCoordinates = geometry.coordinates[0] as Position[];
    return centerOfMass(multiPoint(polygonCoordinates)).geometry
      ?.coordinates as Position;
  } else {
    return [geometry.coordinates[0], geometry.coordinates[1]];
  }
};

export default getPointCoordinates;
