
import React, { ReactElement } from 'react'
import defaultStyle from '../../public/data/styles/root.json';
import openStreeMap from '../../public/data/styles/openStreetMap.json';

interface Props {
    style:any;
}

export default function getMapStyle({style}: Props) {
    let result;
    // first fetch the esri style file
    // https://www.mapbox.com/mapbox-gl-js/style-spec
    if(style === 'openStreeMap') {
        const metadataUrl = openStreeMap.sources.esri.url;
        fetch(metadataUrl)
        .then((response) => {
          return response.json().then(async (metadata) => {
            result = await format(openStreeMap, metadata);
          });
        })
        .catch((e) => {
          console.log('Error:', e);
        });
    } else {
        const metadataUrl = openStreeMap.sources.esri.url;
        fetch(metadataUrl)
        .then((response) => {
          return response.json().then( async (metadata) => {
            result = await format(openStreeMap, metadata);
          });
        })
        .catch((e) => {
          console.log('Error:', e);
        });
    }
    return result;
}

function format(style: any, metadata: any) {
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
        tiles: [style.sources.esri.url + '/' + metadata.tiles[0]],
        description: metadata.description,
        name: metadata.name,
      };
      return style;
}


