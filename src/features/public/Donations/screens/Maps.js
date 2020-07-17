import React from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'


export default function SimpleExample ()  {
  let state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
  }
    const position = [state.lat, state.lng]

   


    return (
      <Map style={{height:'300px',width:'80%'}} center={position} zoom={state.zoom} zoomControl={false}>
        <TileLayer
          url="https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/Forest_Denisty_V2/MapServer"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
          tms={true}
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
    )

}