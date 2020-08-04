import React, { useRef, useState } from 'react';
import MapGL, { Marker, Popup } from 'react-map-gl';
import ProjectSnippet from '../components/ProjectSnippet';
import styles from '../styles/MapboxMap.module.scss';

export default function MapboxMap(props) {
  let mapContainer = useRef(null);
  const { projects } = props;
  const [popupData, setPopupData] = useState({ show: false });

  const [viewport, setViewPort] = useState({
    width: '100%',
    height: 'calc(100% - 60px)',
    latitude: 40.4381311,
    longitude: -3.8196233,
    zoom: 2,
  });

  const center = [40.4381311, -3.8196233];

  const _onViewportChange = (view) => setViewPort({ ...view });

  return (
    <div>
      <MapGL
        {...viewport}
        mapboxApiAccessToken={props.mapboxToken}
        mapStyle="mapbox://styles/mapbox/light-v10"
        onViewportChange={_onViewportChange}
        style={{
          position: 'absolute',
          top: '60px',
        }}
        onClick={() => setPopupData({ ...popupData, show: false })}
      >
        {projects.map((project, index) => (
          <Marker
            key={index}
            latitude={project.geometry.coordinates[1]}
            longitude={project.geometry.coordinates[0]}
            offsetLeft={5}
            offsetTop={-16}
            style={{ left: '28px' }}
          >
            <div
              className={styles.marker}
              onMouseOver={(e) => {
                setPopupData({
                  show: true,
                  lat: project.geometry.coordinates[1],
                  long: project.geometry.coordinates[0],
                  project: project,
                });
              }}
            >
              {/* <img
                src="https://cdn-app.plant-for-the-planet.org/media/maps/pet_p.svg"
                className={styles.markerType}
              /> */}
            </div>
          </Marker>
        ))}
        {popupData.show && (
          <Popup
            latitude={popupData.lat}
            longitude={popupData.long}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setPopupData({ ...popupData, show: false })}
            anchor="bottom"
            dynamicPosition={false}
            offsetTop={-40}
            tipSize={0}
          >
            <ProjectSnippet
              key={popupData.project.properties.id}
              project={popupData.project}
            />
          </Popup>
        )}
      </MapGL>
    </div>
  );
}
