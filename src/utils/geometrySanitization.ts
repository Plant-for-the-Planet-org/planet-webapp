import { cleanCoords, truncate } from '@turf/turf';

export const STAGE_MAP: Record<string, string> = {
  barren: 'PLANNING',
  planned: 'PLANNING',
  planted: 'COMPLETED',
  reforestation: 'ONGOING',
  planting: 'ONGOING',
};

/**
 * Removes spike points from a coordinate ring by dropping any vertex whose
 * interior angle is less than minAngleDeg (default 1°). A near-zero angle
 * means the path doubles back on itself, creating a needle-like artifact.
 *
 * No direct turf equivalent exists for angle-based spike removal.
 */
const removeSpikePoints = (ring: number[][], minAngleDeg = 1): number[][] => {
  const angleBetween = (a: number[], b: number[], c: number[]): number => {
    const v1 = [a[0] - b[0], a[1] - b[1]];
    const v2 = [c[0] - b[0], c[1] - b[1]];
    const dot = v1[0] * v2[0] + v1[1] * v2[1];
    const mag1 = Math.sqrt(v1[0] ** 2 + v1[1] ** 2);
    const mag2 = Math.sqrt(v2[0] ** 2 + v2[1] ** 2);
    if (mag1 === 0 || mag2 === 0) return 0;
    return (Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2)))) * 180) / Math.PI;
  };

  let pts = ring;
  let changed = true;
  while (changed) {
    changed = false;
    const filtered: number[][] = [];
    for (let i = 0; i < pts.length; i++) {
      const prev =
        filtered.length > 0 ? filtered[filtered.length - 1] : pts[(i - 1 + pts.length) % pts.length];
      const next = pts[(i + 1) % pts.length];
      if (angleBetween(prev, pts[i], next) < minAngleDeg) {
        changed = true; // spike — drop this vertex
      } else {
        filtered.push(pts[i]);
      }
    }
    pts = filtered;
    if (pts.length < 3) break;
  }

  return pts.length >= 3 ? pts : ring; // give up — return original if too few points
};

const closeRing = (ring: number[][]): number[][] => {
  if (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1]) {
    return [...ring, [ring[0][0], ring[0][1]]];
  }
  return ring;
};

const sanitizeRings = (rings: number[][][]): number[][][] =>
  rings.map((ring) => closeRing(removeSpikePoints(ring)));

/**
 * Cleans a Polygon or MultiPolygon geometry for submission to the Restor API:
 * 1. turf/truncate  — strips to 2D coordinates and rounds to 6 decimal places
 * 2. turf/cleanCoords — removes consecutive duplicate vertices
 * 3. removeSpikePoints — drops vertices that create near-zero interior angles
 * 4. closeRing — ensures each ring's first and last coordinate are identical
 */
export const sanitizeGeometry = (geometry: {
  type: string;
  coordinates: unknown;
}): { type: string; coordinates: unknown } => {
  if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') return geometry;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const truncated = truncate(geometry as any, { precision: 6, coordinates: 2 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleaned = cleanCoords(truncated as any) as { type: string; coordinates: unknown };

    if (cleaned.type === 'Polygon') {
      return { ...cleaned, coordinates: sanitizeRings(cleaned.coordinates as number[][][]) };
    }
    if (cleaned.type === 'MultiPolygon') {
      return {
        ...cleaned,
        coordinates: (cleaned.coordinates as number[][][][]).map(sanitizeRings),
      };
    }

    return cleaned;
  } catch {
    return geometry;
  }
};

export const buildRestorPayload = (
  properties: { name?: string | null; id: string; status?: string | null },
  geometry: { type: string; coordinates: unknown },
  purpose: string | undefined,
  interventionStartYear: number | ''
) => {
  const stage = STAGE_MAP[(properties.status || '').toLowerCase()] ?? '';

  return {
    type: 'Feature',
    properties: {
      name: properties.name || '',
      siteType: purpose === 'trees' ? 'RESTORATION' : 'CONSERVATION',
      siteVisibility: 'PRIVATE',
      interventionStartYear,
      stage,
      interventionType: 'ACTIVE_RESTORATION',
      goals: ['ENHANCING_ECOSYSTEM_PROCESSES'],
      supportSought: ['MONITORING'],
      externalId: properties.id,
      customFields: [
        { type: 'PLAIN_TEXT', title: 'remoteId', values: properties.id || '' },
        { type: 'PLAIN_TEXT', title: 'lastUpdated', values: '' },
      ],
    },
    geometry: sanitizeGeometry(geometry),
  };
};
