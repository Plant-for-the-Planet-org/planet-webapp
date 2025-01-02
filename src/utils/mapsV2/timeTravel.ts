import timeTravelConfig from '../../../public/data/maps/time-travel.json';

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
