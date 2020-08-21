import * as turf from '@turf/turf';
import React, { useRef, useState } from 'react';
import MapGL, { Layer, Marker, NavigationControl, Source } from 'react-map-gl';
import styles from '../styles/MapboxMap.module.scss';

export default function ProjectMap(props) {
  let mapContainer = useRef(null);
  var timer;
  const { project } = props;
  const [popupData, setPopupData] = useState({ show: false });

  let lat = project.coordinates.lat;
  let lon = project.coordinates.lon;
  let geometryExists = false;
  const geojson = {
    type: 'FeatureCollection',
    features: project.sites,
  };

  var zoomLevel = 15;
  if (typeof geojson.features !== 'undefined' && geojson.features.length > 0) {
    if (geojson.features[0].geometry !== null) {
      geometryExists = true;
      var centroid = turf.centroid(geojson);
      lat = centroid.geometry.coordinates[1];
      lon = centroid.geometry.coordinates[0];
      var bbox = turf.bbox(geojson);
      var bboxPolygon = turf.bboxPolygon(bbox);
      var area = turf.area(bboxPolygon);
      if (area > 2000000000) {
        zoomLevel = 10;
      } else if (area > 600000) {
        zoomLevel = 12;
      } else if (area > 200000) {
        zoomLevel = 14;
      }
    }
  }
  const [viewport, setViewPort] = useState({
    width: '100%',
    height: '100%',
    // latitude: lat,
    // longitude: lon,
    latitude: 40.6892,
    longitude: -74.5447,
    // zoom: zoomLevel,
    zoom: 6,
  });

  const _onViewportChange = (view) => setViewPort({ ...view });

  return (
    <div className={styles.mapContainer}>
      <MapGL
        {...viewport}
        mapboxApiAccessToken={props.mapboxToken}
        mapStyle="mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7"
        onViewportChange={_onViewportChange}
        scrollZoom={false}
        onClick={() => setPopupData({ ...popupData, show: false })}
      >
        {geometryExists === false ? (
          <Marker
            latitude={lat}
            longitude={lon}
            offsetLeft={5}
            offsetTop={-16}
            style={{ left: '28px' }}
          >
            <div className={styles.marker}></div>
          </Marker>
        ) : (
          <Source
            id="singleProject"
            type="raster"
            tiles={[
              'https://img.nj.gov/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015',
            ]}
            // tiles={[
            //   'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/geojson(' +
            //     encodeURI(JSON.stringify(geojson)) +
            //     ')/' +
            //     lat +
            //     ',' +
            //     lon +
            //     '/500x300?access_token=' +
            //     props.mapboxToken,
            // ]}
          >
            <Layer id="ploygonLayer" type="raster" source="singleProject" />
            {/* <Layer
              id="ploygonOutline"
              type="line"
              source="singleProject"
              paint={{
                'line-color': '#89b54a',
                'line-width': 2,
              }}
            /> */}
          </Source>
        )}

        <div className={styles.mapNavigation}>
          <NavigationControl />
        </div>
      </MapGL>
    </div>
  );
}
