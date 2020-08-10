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
    latitude: project.coordinates.lat,
    longitude: project.coordinates.lon,
    zoom: 5,
  });

  // const [viewport, setViewPort] = useState({
  //   width: '100%',
  //   height: '100%',
  //   latitude: 45.137451890638886,
  //   longitude: -68.13734351262877,
  //   zoom: 5,
  // });

  // Ideally should work like this
  console.log(project.geometry);
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: project.geometry
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
        <Source id="maine" type="geojson" data={geojson}>
          <Layer
            id="maine"
            type="fill"
            source="maine"
            paint={{
              'fill-color': '#088',
              'fill-opacity': 0.8,
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
