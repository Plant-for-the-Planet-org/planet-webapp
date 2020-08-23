// import d3 from 'd3';
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
  const sourceRef = React.useRef(null);
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
      let lat = project.coordinates.lat;
      let lon = project.coordinates.lon;
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
      if (sourceRef.current !== null) {
        // let sourceBound = sourceRef.current.getMap().getBounds();
        console.log('SourceRef', sourceRef);
        // mapRef.current.getMap().fitBounds(sourceBound);
        const { longitude, latitude, zoom } = new WebMercatorViewport(
          viewport
        ).fitBounds(sourceRef.current.getMap().getBounds(), {
          padding: 20,
          offset: [0, -100],
        });
        const newViewport = {
          ...viewport,
          longitude,
          latitude,
          zoom,
          transitionDuration: 200,
          transitionInterpolator: new FlyToInterpolator(),
          // transitionEasing: d3.easeCubic,
        };
        setViewPort(newViewport);
        console.log('done');
      }
    }
  }, [project, props.showSingleProject]);

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
