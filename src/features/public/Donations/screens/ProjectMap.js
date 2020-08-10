import React, { useRef, useState } from 'react';
import MapGL, { Layer, NavigationControl, Source } from 'react-map-gl';
import styles from '../styles/MapboxMap.module.scss';

export default function ProjectMap(props) {
  let mapContainer = useRef(null);
  var timer;
  const { project } = props;
  const [popupData, setPopupData] = useState({ show: false });

  const [viewport, setViewPort] = useState({
    width: '100%',
    height: '100%',
    latitude: project.geometry.coordinates[0][0][0][1],
    longitude: project.geometry.coordinates[0][0][0][0],
    zoom: 14,
  });

  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Project Name' },
        geometry: project.geometry,
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
        <div className={styles.mapNavigation}>
          <NavigationControl />
        </div>
      </MapGL>
    </div>
  );
}
