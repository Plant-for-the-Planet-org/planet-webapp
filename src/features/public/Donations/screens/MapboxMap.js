import * as turf from '@turf/turf';
import * as d3 from 'd3-ease';
import React, { useRef, useState } from 'react';
import MapGL, {
  FlyToInterpolator,
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
  WebMercatorViewport,
} from 'react-map-gl';
import PopupProject from '../components/PopupProject';
import styles from '../styles/MapboxMap.module.scss';

export default function MapboxMap(props) {
  let mapContainer = useRef(null);
  var timer;
  const projects = props.projects;
  const project = props.project;
  const [popupData, setPopupData] = useState({ show: false });
  const [open, setOpen] = React.useState(false);
  const mapRef = React.useRef(null);
  const sourceRef = React.createRef();
  const layerRef = React.useRef(null);
  const [geometryExists, setGeometryExists] = React.useState(false);
  const [singleProjectLatLong, setSingleProjectLatLong] = React.useState([
    -28.5,
    36.96,
  ]);
  const [geojson, setGeojson] = React.useState({});

  const [viewport, setViewPort] = useState({
    width: '100%',
    height: '100%',
    latitude: 36.96,
    longitude: -28.5,
    zoom: 1.4,
  });

  // React.useEffect(() => {
  //   console.log('props.showSingleProject effect', props.showSingleProject);
  // }, [props.showSingleProject]);

  React.useEffect(() => {
    console.log('project change useEffect', props.showSingleProject);
    if (props.showSingleProject) {
      console.log('project change useEffect show single project');
      setSingleProjectLatLong([
        project.coordinates.lat,
        project.coordinates.lon,
      ]);

      const newGeojson = {
        type: 'FeatureCollection',
        features: project.sites,
      };

      setGeojson({
        type: 'FeatureCollection',
        features: project.sites,
      });

      if (
        typeof newGeojson.features !== 'undefined' &&
        newGeojson.features.length > 0
      ) {
        if (newGeojson.features[0].geometry !== null) {
          setGeometryExists(true);
        }
      } else {
        setGeometryExists(false);
      }
    }
  }, [project, props.showSingleProject]);

  React.useEffect(() => {
    if (props.showSingleProject) {
      if (geometryExists) {
        var bbox = turf.bbox(geojson);
        bbox = [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ];
        const { longitude, latitude, zoom } = new WebMercatorViewport(
          viewport
        ).fitBounds(bbox, {
          padding: 100,
        });
        const newViewport = {
          ...viewport,
          longitude,
          latitude,
          zoom,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: d3.easeCubic,
        };
        setViewPort(newViewport);
        console.log('done');
      } else {
        const newViewport = {
          ...viewport,
          longitude: singleProjectLatLong[1],
          latitude: singleProjectLatLong[0],
          zoom: 13,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: d3.easeCubic,
        };
        setViewPort(newViewport);
        console.log(singleProjectLatLong);
      }
    }
  }, [project, geometryExists, geojson]);

  React.useEffect(() => {
    if (!props.showSingleProject) {
      const newViewport = {
        ...viewport,
        longitude: -28.5,
        latitude: 36.96,
        zoom: 1.4,
        transitionDuration: 5000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      };
      setViewPort(newViewport);
    }
  }, [props.showSingleProject]);

  const _onViewportChange = (view) => setViewPort({ ...view });

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
        ref={mapRef}
        mapboxApiAccessToken={props.mapboxToken}
        mapStyle="mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7"
        onViewportChange={_onViewportChange}
        scrollZoom={false}
        onClick={() => setPopupData({ ...popupData, show: false })}
      >
        {props.showSingleProject ? (
          !geometryExists ? (
            <Marker
              latitude={singleProjectLatLong[0]}
              longitude={singleProjectLatLong[1]}
              offsetLeft={5}
              offsetTop={-16}
              style={{ left: '28px' }}
            >
              <div className={styles.marker}></div>
            </Marker>
          ) : (
            <Source
              id="singleProject"
              ref={sourceRef}
              type="geojson"
              data={geojson}
            >
              <Layer
                ref={layerRef}
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
          )
        ) : null}
        {!props.showSingleProject &&
          projects.map((project, index) => (
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
