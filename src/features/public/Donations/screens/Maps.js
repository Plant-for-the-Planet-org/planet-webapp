import React, { Component } from 'react'
import * as esri from 'esri-leaflet';
import { Map, TileLayer, addTo } from 'react-leaflet';
export default function Mappage() {
  const mapRef = React.useRef(null);
  const [map,setMap] = React.useState(null)
  

  React.useEffect(() => {
    if(mapRef.current !== null){
      setMap(mapRef.current.leafletElement)
    }
    if(map !== undefined && map !== null){
      esri.basemapLayer('Gray').addTo(map);
      esri.tiledMapLayer({
        url: 'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/Forest_Denisty_V2/MapServer',
         maxZoom: 7,
        minZoom: 1
      }).addTo(map);
  
      esri.tiledMapLayer({
        url: 'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/WWF_Restoration_V2/MapServer',
        minZoom: 1
      }).addTo(map);
    }

  },[map]);
  

const center = [37.7833, -122.4167];
  return (
    <Map
        style={{height: '90vh'}}
        center={center}
        zoom="2"
        ref={mapRef}>
    </Map>
  )
}