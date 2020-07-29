import * as esri from 'esri-leaflet';
import React from 'react';
import { Map, Polygon } from 'react-leaflet';

export default function Mappage(props) {
  const mapRef = React.useRef(null);
  const polyRef = React.useRef(null);
  const [map, setMap] = React.useState(null);
  const [polyMap, setPolyMap] = React.useState(null);
  const { project } = props;

  React.useEffect(() => {
    if (mapRef.current !== null) {
      setMap(mapRef.current.leafletElement);
    }
    if (map !== undefined && map !== null) {
      esri.basemapLayer('Streets').addTo(map);
      // esri.tiledMapLayer({
      //   url: 'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/Forest_Denisty_V2/MapServer',
      //    maxZoom: 7,
      //   minZoom: 1
      // }).addTo(map);

      // esri.tiledMapLayer({
      //   url: 'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/WWF_Restoration_V2/MapServer',
      //   minZoom: 1
      // }).addTo(map);
      const mapLeaf = mapRef.current.leafletElement;
      const group = polyRef.current.leafletElement;
      mapLeaf.fitBounds(group.getBounds());
    }
  }, [map]);

  React.useEffect(() => {
    if (polyRef.current !== null) {
      setPolyMap(polyRef.current.leafletElement);
    }
    if (polyMap !== undefined && polyMap !== null) {
      // esri.basemapLayer('Topographic').addTo(polyMap);
    }
  }, [polyMap]);

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
      <Polygon
        ref={polyRef}
        color="green"
        positions={project.geometry.coordinates}
      />
    </Map>
  );
}
