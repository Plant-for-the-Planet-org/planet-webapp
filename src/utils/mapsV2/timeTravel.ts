import timeTravelConfig from '../../../public/data/maps/time-travel.json';

const WAYBACK_BASE_URL =
  'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile';

/** Hardcoded ESRI wayback machine URLs */
export const getTimeTravelConfig = () => {
  const esri = [];
  for (const [key, year] of Object.entries(timeTravelConfig.esri.wayback)) {
    const url = `${WAYBACK_BASE_URL}/${year.id}/{z}/{y}/{x}`;
    esri.push({ year: key, raster: url });
  }
  return { esri };
};
