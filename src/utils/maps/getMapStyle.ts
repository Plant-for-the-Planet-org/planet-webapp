import defaultStyle from '../../../public/data/styles/root.json';
import openStreetMap from '../../../public/data/styles/OpenStreetMap.json';
import myForestMapStyle from '../../../public/data/styles/MyForestMapStyles.json';

// cspell:ignore tilejson
function format(style: any, metadata: any, metadataUrl: string) {
  // ArcGIS Pro published vector services don't prepend tile or tileMap urls with a /
  style.sources.esri = {
    type: 'vector',
    scheme: 'xyz',
    tilejson: metadata.tilejson || '2.0.0',
    format: (metadata.tileInfo && metadata.tileInfo.format) || 'pbf',
    /* mapbox-gl-js does not respect the indexing of esri tiles
because we cache to different zoom levels depending on feature density, in rural areas 404s will still be encountered.
more info: https://github.com/mapbox/mapbox-gl-js/pull/1377
*/
    // index: metadata.tileMap ? style.sources.esri.url + '/' + metadata.tileMap : null,
    maxzoom: 15,
    tiles: [metadataUrl + '/' + metadata.tiles[0]],
    description: metadata.description,
    name: metadata.name,
  };
  return style;
}

async function fetchTiles(style: any, metadataUrl: string) {
  try {
    const res = await fetch(metadataUrl);
    const response = res.status === 200 ? await res.json() : null;
    return format(style, response, metadataUrl);
  } catch (e: any) {
    console.log('Error:', e);
    return null;
  }
}

export default async function getMapStyle(
  style: 'default' | 'openStreetMap' | 'myForestMap'
) {
  let result = null;
  switch (style) {
    case 'default':
      result = await fetchTiles(
        defaultStyle,
        'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer'
      );
      return result;
    case 'openStreetMap':
      result = await fetchTiles(
        openStreetMap,
        'https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer'
      );
      return result;
    case 'myForestMap':
      result = await fetchTiles(
        myForestMapStyle,
        'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer'
      );
      return result;
    default:
      return result;
  }
}
