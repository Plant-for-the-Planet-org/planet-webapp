import L from 'leaflet'

import * as esri from 'esri-leaflet'
import React from 'react'

export default function Mappage() {

  const mapRef = React.useRef('null');
  console.log("ESRI::",esri);
  console.log("L::",L);

  var map = L.esri.map(mapRef).setView([45.528, -122.680], 13)

        esri.basemapLayer("Streets").addTo(map);

        var parks = esri.featureLayer({
            url: "https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0",
            style: function() {
             return {
                 color: "#70ca49",
                 weight: 2
             };
            }
        }).addTo(map);
  return (
      <div ref={mapRef} style={{position: 'absolute', top:0, bottom:0, right:0, left:0,height:'400px'}}>
      
      </div>
  )
}
