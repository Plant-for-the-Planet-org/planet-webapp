import React, { Component } from 'react'
import L from "leaflet";
import * as esri from 'esri-leaflet';
import { Map, TileLayer, addTo } from 'react-leaflet';
/*
import L from 'leaflet'
import * as esri from 'esri-leaflet'
import React from 'react'
import { Map, TileLayer } from 'react-leaflet';
*/
//Window.this = new L.Maap('map');
export default function Mappage() {
  const mapRef = React.useRef('null');
  console.log("ESRI::",esri);
  console.log("L::",L);
  const map = mapRef.current.leafletElement;
  //const esri = {basemapLayer: "Gray"};
  //return(addTo(map));
  if(map !== undefined){
    esri.basemapLayer('Gray').addTo(map);
  }
// esri.BasemapLayer.
// Layer Forest Density
/*
esri.tiledMapLayer({
url: 'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/Forest_Denisty_V2/MapServer',
maxZoom: 7,
minZoom: 1
}).addTo(map);*/
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