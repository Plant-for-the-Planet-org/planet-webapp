import type { WaybackItem } from '@vannizhang/wayback-core';
import type { Point } from 'geojson';

import timeTravelConfig from '../../../public/data/maps/time-travel.json';
import { getWaybackItemsWithLocalChanges } from '@vannizhang/wayback-core';
import { cacheKeyPrefix } from '../constants/cacheKeyPrefix';
import { getCachedData } from '../../server/utils/cache';

const SOURCE_NAMES = ['esri'] as const;

export type SourceName = (typeof SOURCE_NAMES)[number];

type SingleYearData = { year: string; raster: string };

export type TimeTravelConfig = {
  [key in SourceName]?: SingleYearData[];
};

const SOURCE_BASE_URLS: Record<SourceName, string> = {
  esri: 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile',
};

/** Process data for all time travel sources */
export const getTimeTravelConfig = (): TimeTravelConfig => {
  const result: TimeTravelConfig = {};

  for (const source of SOURCE_NAMES) {
    const sourceData = timeTravelConfig[source]?.wayback;
    if (!sourceData) continue;

    result[source] = [];

    for (const [year, data] of Object.entries(sourceData)) {
      if (data?.id && data.id.length > 0) {
        const url = `${SOURCE_BASE_URLS[source]}/${data.id}/{z}/{y}/{x}`;
        result[source].push({ year, raster: url });
      }
    }
  }

  return result;
};

/**
 * Converts WMTS URL format ({level}/{row}/{col}) to standard tile format (z/y/x)
 */
const convertToZYXFormat = (url: string): string => {
  return url
    .replace('{level}', '{z}')
    .replace('{row}', '{y}')
    .replace('{col}', '{x}');
};

interface SingleYearTimeTravelData {
  year: string;
  rasterUrl: string;
}

const getLatestByYear = (items: WaybackItem[]): SingleYearTimeTravelData[] => {
  const intermediate = items.reduce<
    Record<string, { rasterUrl: string; timestamp: number }>
  >((acc, item) => {
    const year = new Date(item.releaseDatetime).getFullYear().toString();
    const existing = acc[year];

    if (!existing || item.releaseDatetime > existing.timestamp) {
      acc[year] = {
        rasterUrl: convertToZYXFormat(item.itemURL),
        timestamp: item.releaseDatetime,
      };
    }

    return acc;
  }, {});

  // Transform to array format
  return Object.entries(intermediate).map(([year, item]) => ({
    year,
    rasterUrl: item.rasterUrl,
  }));
};

export type ProjectTimeTravelSources = {
  [key in SourceName]?: SingleYearTimeTravelData[];
};

export type ProjectTimeTravelConfig = {
  projectId: string;
  sources: ProjectTimeTravelSources | null;
};

export const getProjectTimeTravelConfig = async (
  projectId: string,
  projectPointGeometry: Point
): Promise<ProjectTimeTravelConfig | null> => {
  const CACHE_KEY = `${cacheKeyPrefix}_time-travel_${projectId}`;
  // TODO - change temp cache time
  const CACHE_TIME_IN_SECONDS = 60 * 5; /* 60 * 60 * 24 */

  async function fetchTimeTravelData(): Promise<ProjectTimeTravelConfig> {
    const esriWaybackItems = await getWaybackItemsWithLocalChanges(
      {
        longitude: projectPointGeometry.coordinates[0],
        latitude: projectPointGeometry.coordinates[1],
      },
      13 //TODO - confirm zoom level and update
    );

    if (esriWaybackItems.length === 0) {
      return { projectId: projectId, sources: null };
    } else {
      return {
        projectId: projectId,
        sources: { esri: getLatestByYear(esriWaybackItems) },
      };
    }
  }

  try {
    return await getCachedData(
      CACHE_KEY,
      fetchTimeTravelData,
      CACHE_TIME_IN_SECONDS
    );
  } catch (err) {
    console.error('Error fetching time travel data:', err);
    // Return empty config on error to gracefully degrade
    return null;
  }
};
