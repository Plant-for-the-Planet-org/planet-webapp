import React, { useRef, useState } from 'react';
import MapGL, { Layer, NavigationControl, Source } from 'react-map-gl';
import styles from '../styles/MapboxMap.module.scss';

export default function ProjectMap(props) {
  let mapContainer = useRef(null);
  var timer;
  const { project } = props;
  const [popupData, setPopupData] = useState({ show: false });

  //   const [viewport, setViewPort] = useState({
  //     width: '100%',
  //     height: '100%',
  //     latitude: project.coordinates.lat,
  //     longitude: project.coordinates.lon,
  //     zoom: 5,
  //   });

  const [viewport, setViewPort] = useState({
    width: '100%',
    height: '100%',
    latitude: 45.137451890638886,
    longitude: -68.13734351262877,
    zoom: 5,
  });

  // Ideally should work like this

  //   const geojson = {
  //     type: 'geojson',
  //     features: [
  //       {
  //         type: 'Feature',
  //         geometry: {
  //           type: 'Polygon',
  //           coordinates: project.geometry.coordinates,
  //         },
  //       },
  //     ],
  //   };

  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-67.13734351262877, 45.137451890638886],
              [-66.96466, 44.8097],
              [-68.03252, 44.3252],
              [-69.06, 43.98],
              [-70.11617, 43.68405],
              [-70.64573401557249, 43.090083319667144],
              [-70.75102474636725, 43.08003225358635],
              [-70.79761105007827, 43.21973948828747],
              [-70.98176001655037, 43.36789581966826],
              [-70.94416541205806, 43.46633942318431],
              [-71.08482, 45.3052400000002],
              [-70.6600225491012, 45.46022288673396],
              [-70.30495378282376, 45.914794623389355],
              [-70.00014034695016, 46.69317088478567],
              [-69.23708614772835, 47.44777598732787],
              [-68.90478084987546, 47.184794623394396],
              [-68.23430497910454, 47.35462921812177],
              [-67.79035274928509, 47.066248887716995],
              [-67.79141211614706, 45.702585354182816],
              [-67.13734351262877, 45.137451890638886],
            ],
          ],
        },
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
