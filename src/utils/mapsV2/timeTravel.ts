import type { WaybackItem } from '@vannizhang/wayback-core';
import type { Point } from 'geojson';

import { getWaybackItemsWithLocalChanges } from '@vannizhang/wayback-core';
import { cacheKeyPrefix } from '../constants/cacheKeyPrefix';
import { getCachedData } from '../../server/utils/cache';

export type SourceName = 'esri';

/**
 * Converts WMTS URL format ({level}/{row}/{col}) to standard tile format (z/y/x)
 */
const convertToZYXFormat = (url: string): string => {
  return url
    .replace('{level}', '{z}')
    .replace('{row}', '{y}')
    .replace('{col}', '{x}');
};

export interface SingleYearTimeTravelData {
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
  const CACHE_TIME_IN_SECONDS = 60 * 60 * 24 * 30; // cached for 30 days

  async function fetchTimeTravelData(): Promise<ProjectTimeTravelConfig> {
    if (
      !Array.isArray(projectPointGeometry?.coordinates) ||
      projectPointGeometry.coordinates.length !== 2
    ) {
      throw new Error('Invalid project point geometry');
    }

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
