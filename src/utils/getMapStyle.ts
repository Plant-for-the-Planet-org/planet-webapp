import defaultStyle from '../../public/data/styles/root.json';
import openStreetMap from '../../public/data/styles/OpenStreetMap.json';

export default function getMapStyle(style:any) {
    if(style==='default') {
        return fetchTiles(defaultStyle, 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer');
    } else if(style==='openStreetMap') {
      return fetchTiles(openStreetMap, 'https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer');
    } else {
      return null;
    }
}

async function fetchTiles(style:any, metadataUrl:any) {
    try {
    const res = await fetch(metadataUrl);
    const response = res.status === 200 ? await res.json() : null;
    return format(style, response, metadataUrl);
    }catch(e:any){
      console.log('Error:', e);
      return null;
    }
  }

function format(style: any, metadata: any, metadataUrl:any) {
// ArcGIS Pro published vector services dont prepend tile or tileMap urls with a /
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