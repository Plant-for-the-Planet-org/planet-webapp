export const STAGE_MAP: Record<string, string> = {
  barren: 'PLANNING',
  planned: 'PLANNING',
  planted: 'COMPLETED',
  reforestation: 'ONGOING',
  planting: 'ONGOING',
};

export const sanitizePolygonRing = (ring: number[][]): number[][] => {
  const PRECISION = 6;
  const NEAR_DUPLICATE_THRESHOLD = 1e-6;
  const MIN_ANGLE_DEG = 1;

  // 1. Round to safe precision
  let pts = ring.map(([lng, lat]) => [
    parseFloat(lng.toFixed(PRECISION)),
    parseFloat(lat.toFixed(PRECISION)),
  ]);

  // 2. Remove near-duplicate consecutive points
  pts = pts.filter((pt, i) => {
    if (i === 0) return true;
    const prev = pts[i - 1];
    return (
      Math.abs(pt[0] - prev[0]) > NEAR_DUPLICATE_THRESHOLD ||
      Math.abs(pt[1] - prev[1]) > NEAR_DUPLICATE_THRESHOLD
    );
  });

  // 3. Remove spike points (angle < MIN_ANGLE_DEG means the path doubles back)
  const angleBetween = (a: number[], b: number[], c: number[]): number => {
    const v1 = [a[0] - b[0], a[1] - b[1]];
    const v2 = [c[0] - b[0], c[1] - b[1]];
    const dot = v1[0] * v2[0] + v1[1] * v2[1];
    const mag1 = Math.sqrt(v1[0] ** 2 + v1[1] ** 2);
    const mag2 = Math.sqrt(v2[0] ** 2 + v2[1] ** 2);
    if (mag1 === 0 || mag2 === 0) return 0;
    return (Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2)))) * 180) / Math.PI;
  };
  let changed = true;
  while (changed) {
    changed = false;
    const filtered: number[][] = [];
    for (let i = 0; i < pts.length; i++) {
      const prev =
        filtered.length > 0 ? filtered[filtered.length - 1] : pts[(i - 1 + pts.length) % pts.length];
      const next = pts[(i + 1) % pts.length];
      const angle = angleBetween(prev, pts[i], next);
      if (angle < MIN_ANGLE_DEG) {
        changed = true; // spike — skip this point
      } else {
        filtered.push(pts[i]);
      }
    }
    pts = filtered;
    if (pts.length < 3) break;
  }

  if (pts.length < 3) return ring; // give up — return original

  // 4. Ensure ring is closed
  const first = pts[0];
  const last = pts[pts.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    pts.push([first[0], first[1]]);
  }

  return pts;
};

export const sanitizeGeometry = (geometry: {
  type: string;
  coordinates: unknown;
}): { type: string; coordinates: unknown } => {
  try {
    if (geometry.type === 'Polygon') {
      const rings = geometry.coordinates as number[][][];
      return { ...geometry, coordinates: rings.map(sanitizePolygonRing) };
    }
    if (geometry.type === 'MultiPolygon') {
      const polys = geometry.coordinates as number[][][][];
      return { ...geometry, coordinates: polys.map((rings) => rings.map(sanitizePolygonRing)) };
    }
  } catch {
    // fall through to return original
  }
  return geometry;
};

export const convertTo2D = (coords: unknown): unknown => {
  if (!Array.isArray(coords)) return coords;
  if (typeof coords[0] === 'number') return (coords as number[]).slice(0, 2);
  return (coords as unknown[]).map(convertTo2D);
};

export const buildRestorPayload = (
  properties: { name?: string | null; id: string; status?: string | null },
  geometry: { type: string; coordinates: unknown },
  purpose: string | undefined,
  interventionStartYear: number | ''
) => {
  const status = (properties.status || '').toLowerCase();
  const stage = STAGE_MAP[status] ?? '';
  const cleanedGeometry = sanitizeGeometry({
    ...geometry,
    coordinates: convertTo2D(geometry.coordinates) as unknown,
  });

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
    geometry: cleanedGeometry,
  };
};
