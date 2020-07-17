import L from 'leaflet'

import * as esri from 'esri-leaflet'
import React from 'react'
import { Map, TileLayer } from 'react-leaflet';

export default function Mappage() {

  const mapRef = React.useRef('null');
  console.log("ESRI::",esri);
  console.log("L::",L);

  const map = mapRef.current.leafletElement;
//    = L.esri.map(mapRef).setView([45.528, -122.680], 13)
 
// esri.basemapLayer('Topographic').addTo(map)
// // esri.BasemapLayer.
// // Layer Forest Density
//   esri.tiledMapLayer({
//     url: 'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/Forest_Denisty_V2/MapServer',
// //    maxZoom: 7,
//     minZoom: 1
//   }).addTo(map);
const center = [37.7833, -122.4167];
  return (
    <Map 
        style={{height: '400px'}}
        center={center} 
        zoom="10"
        ref={mapRef}>
        <TileLayer
            attribution="Leaflet | Powered by Esri | HERE, DeLorme, MapmyIndia, © OpenStreetMap contributors"
            url={'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/Forest_Denisty_V2/MapServer'} />
        <div className='pointer'></div>
    </Map>
  )
}
