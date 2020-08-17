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
  let geometry = project.geometry;

  if (project.geometry !== null) {
    var centroid = turf.centroid(project.geometry);
    lat = centroid.geometry.coordinates[1];
    lon = centroid.geometry.coordinates[0];
  }

  const [viewport, setViewPort] = useState({
    width: '100%',
    height: '100%',
    latitude: lat,
    longitude: lon,
    zoom: 13,
  });

  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Project Name' },
        geometry: geometry,
      },
    ],
  };

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
        {project.geometry === null ? (
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
          <Source id="singleProject" type="geojson" data={geojson}>
            <Layer
              id="ploygonLayer"
              type="fill"
              source="singleProject"
              paint={{
                'fill-color': '#fff',
                'fill-opacity': 0.2,
              }}
            />
            <Layer
              id="ploygonOutline"
              type="line"
              source="singleProject"
              paint={{
                'line-color': '#89b54a',
                'line-width': 2,
              }}
            />
          </Source>
        )}

        <div className={styles.mapNavigation}>
          <NavigationControl />
        </div>
      </MapGL>
    </div>
  );
}
