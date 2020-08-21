import * as turf from '@turf/turf';
import * as d3 from 'd3-ease';
import React, { useRef, useState } from 'react';
import MapGL, {
  FlyToInterpolator,
  Marker,
  NavigationControl,
  Popup,
} from 'react-map-gl';
import PopupProject from '../components/PopupProject';
import styles from '../styles/MapboxMap.module.scss';

export default function MapboxMap(props) {
  let mapContainer = useRef(null);
  var timer;
  console.log(props);
  const projects = props.props.projects;
  const project = props.props.project;
  const [popupData, setPopupData] = useState({ show: false });
  const [open, setOpen] = React.useState(false);

  console.log(project);
  if (project !== null) {
    let lat = project.coordinates.lat;
    let lon = project.coordinates.lon;
    let geometryExists = false;
    const geojson = {
      type: 'FeatureCollection',
      features: project.sites,
    };

    var zoomLevel = 15;
    if (
      typeof geojson.features !== 'undefined' &&
      geojson.features.length > 0
    ) {
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
    // _flyToProject();
  }

  const [viewport, setViewPort] = useState({
    width: '100%',
    height: '100%',
    latitude: 36.96,
    longitude: -28.5,
    zoom: 1.4,
  });

  const _onViewportChange = (view) => {
    setViewPort({ ...view });
  };

  const _flyToProject = () => {
    const view = {
      ...viewport,
      longitude: lat,
      latitude: lon,
      zoom: zoomLevel,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic,
    };
    _onViewportChange(view);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

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
                timer = setTimeout(function () {
                  setPopupData({
                    show: true,
                    lat: project.geometry.coordinates[1],
                    long: project.geometry.coordinates[0],
                    project: project,
                  });
                }, 300);
              }}
              onMouseLeave={(e) => {
                clearTimeout(timer);
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
            offsetTop={20}
            tipSize={0}
          >
            <div
              className={styles.popupProject}
              onMouseLeave={(e) => {
                if (!open) {
                  setTimeout(function () {
                    setPopupData({ ...popupData, show: false });
                  }, 300);
                  handleClose();
                }
              }}
            >
              <PopupProject
                key={popupData.project.properties.id}
                project={popupData.project}
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
              />
            </div>
          </Popup>
        )}
        <div className={styles.mapNavigation}>
          <NavigationControl />
        </div>
      </MapGL>
    </div>
  );
}
