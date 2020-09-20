/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import * as turf from '@turf/turf';
import * as d3 from 'd3-ease';
import { useRouter } from 'next/router';
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
import getTranslation from '../../../../../public/locales/getTranslations';
import LeftIcon from '../../../../assets/images/icons/LeftIcon';
import RightIcon from '../../../../assets/images/icons/RightIcon';
import PopupProject from '../components/PopupProject';
import styles from '../styles/MapboxMap.module.scss';

interface mapProps {
  projects: any;
  project: any;
  showSingleProject: Boolean;
  fetchSingleProject: Function;
  setSearchedProjects: Function;
  projectsContainer: any;
  setShowSingleProject: Function;
  mapboxToken: any;
}
export default function MapboxMap(props: mapProps) {
  const t = getTranslation();
  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout;
  const router = useRouter();
  const { projects, project, showSingleProject, mapboxToken } = props;
  const mapRef = useRef(null);
  const parentRef = useRef(null);
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 767;
  const [popupData, setPopupData] = useState({ show: false });
  const [open, setOpen] = React.useState(false);
  const [siteExists, setsiteExists] = React.useState(false);
  const defaultMapCenter = isMobile ? [22.54, 9.59] : [36.96, -28.5];
  const defaultZoom = isMobile ? 1 : 1.4;
  const [singleProjectLatLong, setSingleProjectLatLong] = React.useState([
    defaultMapCenter[0],
    defaultMapCenter[1],
  ]);
  const [geojson, setGeojson] = React.useState({});
  const [maxSites, setMaxSites] = React.useState();
  const [currentSite, setCurrentSite] = React.useState<null | Number>();

  const [mapState, setMapState] = useState({
    mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
  });

  const [viewport, setViewPort] = useState({
    width: Number('100%'),
    height: Number('100%'),
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  React.useEffect(() => {
    mapRef.current.getMap().resize();
  }, [window.width, window.height]);

  React.useEffect(() => {
    if (props.showSingleProject) {
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
          setsiteExists(true);
          setCurrentSite(0);
          setMaxSites(newGeojson.features.length);
        } else {
          setsiteExists(false);
        }
      } else {
        setsiteExists(false);
      }
    } else if (project !== null) {
      const newMapState = {
        mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
      };
      const newViewport = {
        ...viewport,
        latitude: defaultMapCenter[0],
        longitude: defaultMapCenter[1],
        zoom: 1.4,
        transitionDuration: 2400,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      };
      setMapState(newMapState);
      setViewPort(newViewport);
    }
  }, [project, showSingleProject]);

  React.useEffect(() => {
    if (props.showSingleProject) {
      if (siteExists) {
        let bbox = turf.bbox(geojson.features[currentSite]);
        bbox = [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ];
        const { longitude, latitude, zoom } = new WebMercatorViewport(
          viewport
        ).fitBounds(bbox, {
          padding: {
            top: 50,
            bottom: isMobile ? 120 : 50,
            left: isMobile ? 50 : 400,
            right: isMobile ? 50 : 100,
          },
        });
        const newMapState = {
          mapStyle: 'mapbox://styles/mapbox/satellite-v9',
        };
        const newViewport = {
          ...viewport,
          longitude,
          latitude,
          zoom,
          transitionDuration: 4000,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: d3.easeCubic,
        };
        setViewPort(newViewport);
        setMapState(newMapState);
        router.push(`/?p=${project.slug}`, undefined, { shallow: true });
      } else {
        const newMapState = {
          mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
        };
        const newViewport = {
          ...viewport,
          longitude: singleProjectLatLong[1],
          latitude: singleProjectLatLong[0],
          zoom: 5,
          transitionDuration: 4000,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: d3.easeCubic,
        };

        setViewPort(newViewport);
        router.push(`/?p=${project.slug}`, undefined, { shallow: true });
        setMapState(newMapState);
      }
    }
  }, [project, siteExists, geojson]);

  React.useEffect(() => {
    if (props.showSingleProject && siteExists) {
      if (currentSite < maxSites) {
        let bbox = turf.bbox(geojson.features[currentSite]);
        bbox = [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ];
        const { longitude, latitude, zoom } = new WebMercatorViewport(
          viewport
        ).fitBounds(bbox, {
          padding: {
            top: 50,
            bottom: isMobile ? 120 : 50,
            left: isMobile ? 50 : 400,
            right: isMobile ? 50 : 100,
          },
        });
        const newMapState = {
          mapStyle: 'mapbox://styles/mapbox/satellite-v9',
        };
        const newViewport = {
          ...viewport,
          longitude,
          latitude,
          zoom,
          transitionDuration: 4000,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: d3.easeCubic,
        };
        setViewPort(newViewport);
        setMapState(newMapState);
        router.push(`/?p=${project.slug}`, undefined, { shallow: true });
      }
    }
  }, [currentSite]);

  const _onStateChange = (state: any) => setMapState({ ...state });

  const _onViewportChange = (view: any) => setViewPort({ ...view });

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  function goToNextProject() {
    if (currentSite < maxSites - 1) {
      setCurrentSite(currentSite + 1);
    } else {
      setCurrentSite(0);
    }
  }

  function goToPrevProject() {
    if (currentSite > 0) {
      setCurrentSite(currentSite - 1);
    } else {
      setCurrentSite(maxSites - 1);
    }
  }

  const handleOpenProject = async (id) => {
    await props.fetchSingleProject(id);
    props.setShowSingleProject(true);
  };

  return (
    <div ref={parentRef} className={styles.mapContainer}>
      <MapGL
        ref={mapRef}
        {...mapState}
        {...viewport}
        mapboxApiAccessToken={mapboxToken}
        mapOptions={{
          customAttribution: `<a href="https://plant-for-the-planet.org/en/footermenu/privacy-policy">${t.privacyAndTerms}</a> <a href="https://plant-for-the-planet.org/en/footermenu/imprint">${t.imprint}</a> <a href="mailto:support@plant-for-the-planet.org">${t.contact}</a>`,
        }}
        onViewportChange={_onViewportChange}
        onStateChange={_onStateChange}
        scrollZoom={false}
        onClick={() => setPopupData({ ...popupData, show: false })}
      >
        {showSingleProject ? (
          !siteExists ? (
            <Marker
              latitude={singleProjectLatLong[0]}
              longitude={singleProjectLatLong[1]}
              offsetLeft={5}
              offsetTop={-16}
              style={{ left: '28px' }}
            >
              <div className={styles.marker} />
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
          )
        ) : null}
        {!showSingleProject &&
          projects.map((projectMarker: any, index: any) => (
            <Marker
              key={index}
              latitude={projectMarker.geometry.coordinates[1]}
              longitude={projectMarker.geometry.coordinates[0]}
              offsetLeft={5}
              offsetTop={-16}
              style={{ left: '28px' }}
            >
              <div
                className={styles.marker}
                onClick={() => handleOpenProject(projectMarker.properties.id)}
                onKeyPress={() =>
                  handleOpenProject(projectMarker.properties.id)
                }
                role="button"
                tabIndex={0}
                onMouseOver={() => {
                  timer = setTimeout(() => {
                    setPopupData({
                      show: true,
                      lat: projectMarker.geometry.coordinates[1],
                      long: projectMarker.geometry.coordinates[0],
                      project: projectMarker,
                    });
                  }, 300);
                }}
                onMouseLeave={() => {
                  clearTimeout(timer);
                }}
                onFocus={() => {}}
              >
                {/* <img
                src="https://cdn-app.plant-for-the-planet.org/media/maps/pet_p.svg"
                className={styles.markerType}
              /> */}
              </div>
            </Marker>
          ))}
        {popupData.show && !isMobile && (
          <Popup
            latitude={popupData.lat}
            longitude={popupData.long}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setPopupData({ ...popupData, show: false })}
            anchor="bottom"
            dynamicPosition={false}
            offsetTop={-15}
            tipSize={0}
          >
            <div
              className={styles.popupProject}
              onClick={() => handleOpenProject(popupData.project.properties.id)}
              onKeyPress={() =>
                handleOpenProject(popupData.project.properties.id)
              }
              role="button"
              tabIndex={0}
              onMouseLeave={() => {
                if (!open) {
                  setTimeout(() => {
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
          <NavigationControl showCompass={false} />
        </div>
        {showSingleProject && siteExists ? (
          maxSites! > 1 ? (
            <div className={styles.projectControls}>
              <div
                onClick={goToPrevProject}
                onKeyPress={goToPrevProject}
                role="button"
                tabIndex={0}
              >
                <LeftIcon />
              </div>

              <p className={styles.projectControlText}>
                &nbsp;&nbsp;
                {siteExists &&
                project.sites.length !== 0 &&
                geojson.features[currentSite]
                  ? geojson.features[currentSite].properties.name
                  : null}
                &nbsp;&nbsp;
              </p>
              <div
                onClick={goToPrevProject}
                onKeyPress={goToPrevProject}
                role="button"
                tabIndex={0}
              >
                <RightIcon />
              </div>
            </div>
          ) : null
        ) : null}
      </MapGL>
    </div>
  );
}
