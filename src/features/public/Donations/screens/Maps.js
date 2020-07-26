import * as esri from 'esri-leaflet';
import React from 'react';
import { Map, Marker, Popup } from 'react-leaflet';

export default function Mappage(props) {
  const mapRef = React.useRef(null);
  const [map, setMap] = React.useState(null);
  const [markersData, setMarkersData] = React.useState([]);

  React.useEffect(() => {
    if (mapRef.current !== null) {
      setMap(mapRef.current.leafletElement);
    }
    if (map !== undefined && map !== null) {
      esri.basemapLayer('Gray').addTo(map);
      // esri.tiledMapLayer({
      //   url: 'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/Forest_Denisty_V2/MapServer',
      //    maxZoom: 7,
      //   minZoom: 1
      // }).addTo(map);

      // esri.tiledMapLayer({
      //   url: 'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/WWF_Restoration_V2/MapServer',
      //   minZoom: 1
      // }).addTo(map);
    }
  }, [map]);

  // adds marker data of coordinate and type to markersData state
  React.useEffect(() => {
    const { projects } = props;
    let markers = [];
    for (let i = 0; i < projects.length; i++) {
      markers.push({
        position: [
          projects[i].geometry.coordinates[1],
          projects[i].geometry.coordinates[0],
        ],
        type: projects[i].type,
      });
    }
    setMarkersData(markers);
  }, [props.projects]);

  const center = [37.7833, -122.4167];
  return (
    <Map
      style={{
        height: '100vh',
        position: 'absolute',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        width: '100%',
        zIndex: '4',
      }}
      center={center}
      zoom="2"
      ref={mapRef}
    >
      {markersData.map((item, index) => (
        <Marker key={index} position={item.position}>
          <Popup>
            <span>Popup</span>
          </Popup>
        </Marker>
      ))}
    </Map>
  );
}
